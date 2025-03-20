import { Request, Response } from "express";
import EmployeeModel from "../models/Employee";
import UserModel from "../models/User";
import { IUser } from "../models/types";
import mongoose from "mongoose";

export const add_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, created_date, holiday_calendar, manager_set, shift_from, shift_to, selfManage } = req.body;
        const created_by_manager = req.user._id; // Use ObjectId instead of email

        console.log("Received manager_set:", manager_set);

        // Ensure `manager_set` is an array before using `.map()`
        if (!Array.isArray(manager_set)) {
            res.status(400).json({ message: "manager_set must be an array.", success: false });
            return;
        }

        // Convert `holiday_calendar` to ObjectId
        if (!holiday_calendar) {
            res.status(400).json({ message: "Holiday calendar is required.", success: false });
            return;
        }

        // Convert `manager_set` to valid ObjectId references
        let validatedManagers: mongoose.Types.ObjectId[] = [];

        validatedManagers = (await Promise.all(
            manager_set.map(async (managerId: string) => {
                const user = await UserModel.findById(managerId);
                return user ? new mongoose.Types.ObjectId(managerId) : null;
            })
        )).filter((id): id is mongoose.Types.ObjectId => id !== null);

        // If self-managed, add the manager if not already present
        const managerObjectId = new mongoose.Types.ObjectId(created_by_manager);
        if (selfManage && !validatedManagers.some(id => id.equals(managerObjectId))) {
            validatedManagers.push(managerObjectId);
        }

        const employee = new EmployeeModel({
            name,
            created_by_manager,
            created_date,
            holiday_calendar,
            manager_set: validatedManagers,
            shift_from,
            shift_to
        });

        await employee.save();

        res.status(201).json({
            message: `Employee ${name} has been created successfully.`,
            success: true,
            employee
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};


export const get_employee = async (req: Request, res: Response): Promise<any> => {
    try {
        const managerId = req.user._id;

        // Find employees where the user is in `manager_set` or is the creator
        const employees = await EmployeeModel.find({
            $or: [
                { manager_set: managerId },
                { created_by_manager: managerId }
            ]
        });

        if (employees.length === 0) {
            return res.status(404).json({
                message: "No employees found for this manager.",
                success: false
            });
        }

        res.status(200).json({
            message: "Employees found successfully.",
            success: true,
            data: employees
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

// DELETE employee by ID
export const delete_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const managerId = req.user._id;

        if (!id) {
            res.status(400).json({ message: "Employee ID is required.", success: false });
            return;
        }

        const employee = await EmployeeModel.findOne({ _id:id });

        if (!employee) {
            res.status(404).json({ message: "Employee not found.", success: false });
            return;
        }

        // Authorization check
        if (employee.created_by_manager.toString() !== managerId) {
            res.status(403).json({ message: "You're not authorized to delete this employee.", success: false });
            return;
        }

        await EmployeeModel.deleteOne({ _id:id });

        res.status(200).json({ message: "Employee deleted successfully.", success: true });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

export const update_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        let updateData = req.body;
        const managerId = req.user._id; // Ensure `req.user` exists

        // Validate Employee ID
        if (!id) {
            res.status(400).json({ message: "Employee ID is required.", success: false });
            return;
        }

        // Convert ID to MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(id as string);

        // Validate updateData
        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Update data is required.", success: false });
            return;
        }

        // Find the employee
        const employee = await EmployeeModel.findOne({ _id: objectId });

        if (!employee) {
            res.status(404).json({ message: "Employee not found.", success: false });
            return;
        }

        // Authorization check
        if (employee.created_by_manager.toString() !== managerId.toString()) {
            res.status(403).json({ message: "You're not authorized to update this employee.", success: false });
            return;
        }

        // Update the employee
        const updatedEmployee = await EmployeeModel.findOneAndUpdate(
            { _id: objectId },
            updateData,
            { new: true, runValidators: true } // ✅ Ensures validation
        );

        res.status(200).json({
            message: "Employee updated successfully.",
            success: true,
            updatedEmployee,
        });
    } catch (error) {
        console.error("Update Employee Error:", error); // ✅ Logs error details
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};


export const get_employee_manager_set = async (req: Request, res: Response): Promise<any> => {
    try {
        const managerIds: string[] = req.body;
        
        if (!Array.isArray(managerIds) || managerIds.length === 0) {
            return res.status(400).json({ message: "Invalid or empty manager IDs array.", success: false });
        }
        
        const managers = await UserModel.find({ _id: { $in: managerIds } }, "name email");
        
        if (managers.length === 0) {
            return res.status(404).json({ message: "No managers found for the given IDs.", success: false });
        }
        
        res.status(200).json({
            message: "Managers retrieved successfully.",
            success: true,
            manager_set: managers
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

export const get_managers = async (req: Request, res: Response): Promise<any> => {
    try {
        // Fetch all users from the UserModel with _id, name, and email
        const managers = await UserModel.find({}, "_id name email");

        if (managers.length === 0) {
            return res.status(404).json({ message: "No managers found.", success: false });
        }

        res.status(200).json({
            message: "Managers retrieved successfully.",
            success: true,
            managers: managers
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};


