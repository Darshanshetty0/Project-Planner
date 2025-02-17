import { Request, Response } from "express";
import EmployeeModel from "../models/Employee";

export const add_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, created_date, id, holiday_calendar, manager_set, shift_from, shift_to, selfManage } = req.body;
        const created_by_manager_email = req.user.email;
        const employee = await EmployeeModel.findOne({ id });;
        if (employee) {
            res.status(409).json({message: 'Employee with the same ID already exists. Please go for a differnt ID', success: false});
            return;
        }
        if (selfManage) {
            // Check if the manager already exists in the set
            const exists = manager_set.some((manager: { manager_email: string }) => manager.manager_email === created_by_manager_email);
        
            if (!exists) {
                manager_set.push({ manager_email: created_by_manager_email });
            }
        }               
        const employeeModel = new EmployeeModel({ name, created_by_manager_email, created_date, id, holiday_calendar, manager_set, shift_from, shift_to });
        await employeeModel.save();
        console.log(employeeModel);
        res.status(201).json({
            message: 'Employee' + name + ' has been created successfully',
            success: true,
            created_by_manager_email: created_by_manager_email
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const get_employee = async (req: Request, res: Response): Promise<any> => {
    try {
        // Extract manager_email from the query parameters
        const manager_email = req.user.email;
        if (!manager_email) {
            return res.status(400).json({
                message: "Manager email is required.",
                success: false
            });
        }

        // Find employees who have the manager_email in their manager_set array
        const employees = await EmployeeModel.find({
            $or: [
                { manager_set: { $elemMatch: { manager_email: manager_email } } },
                { created_by_manager_email: manager_email }
            ]
        });

        // If no employees are found, return a 404
        if (employees.length === 0) {
            return res.status(404).json({
                message: "No employees found for the given manager email.",
                success: false
            });
        }

        // Return the found employees
        res.status(200).json({
            message: "Employees found successfully.",
            success: true,
            data: employees
        });
    } catch (err) {
        // Catch any errors and return a 500 error
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


export const get_employee_created = async (req: Request, res: Response):Promise<any> => {
    try {
        // Extract manager_email from the query parameters
        const manager_email = req.user.email as string;
        if (!manager_email) {
            return res.status(400).json({
                message: "Manager email is required.",
                success: false
            });
        }

        // Find employees who have the manager_email in their manager_set array
        const employees = await EmployeeModel.find({ created_by_manager_email: manager_email });
        // If no employees are found, return a 404
        if (employees.length === 0) {
            return res.status(404).json({
                message: "No employees found created by this manager.",
                success: false
            });
        }

        // Return the found employees
        res.status(200).json({
            message: "Employees found successfully.",
            success: true,
            data: employees
        });
    } catch (err) {
        // Catch any errors and return a 500 error
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


// DELETE employee by ID
export const delete_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const manager_email = req.user.email;

        if (!id) {
            res.status(400).json({ message: "Employee ID is required.", success: false });
            return;
        }

        // Find the employee
        const employee = await EmployeeModel.findOne({ id });

        if (!employee) {
            res.status(404).json({ message: "Employee not found.", success: false });
            return;
        }

        // Check if the requesting manager is authorized
        if (employee.created_by_manager_email !== manager_email) {
            res.status(403).json({ message: "You're not authorized to delete this employee.", success: false });
            return;
        }

        await EmployeeModel.deleteOne({ id });

        res.status(200).json({ message: "Employee deleted successfully.", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// UPDATE employee by ID
export const update_employee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const manager_email = req.user.email;

        if (!id) {
            res.status(400).json({ message: "Employee ID is required.", success: false });
            return;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Update data is required.", success: false });
            return;
        }

        // Find the employee
        const employee = await EmployeeModel.findOne({ id });

        if (!employee) {
            res.status(404).json({ message: "Employee not found.", success: false });
            return;
        }

        // Check if the requesting manager is authorized
        if (employee.created_by_manager_email !== manager_email) {
            res.status(403).json({ message: "You're not authorized to update this employee.", success: false });
            return;
        }

        const updatedEmployee = await EmployeeModel.findOneAndUpdate({ id }, updateData, { new: true });

        res.status(200).json({
            message: "Employee updated successfully.",
            success: true,
            updatedEmployee,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
