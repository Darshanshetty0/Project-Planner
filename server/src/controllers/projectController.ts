import { Request, Response } from "express";
import mongoose from "mongoose";
import ProjectModel from "../models/Project";
import EmployeeModel from "../models/Employee";
import UserModel from "../models/User";

export const add_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, desc, created_date, deadline_date, tasksSet, employeeSet, managerSet } = req.body;
        const created_by_manager = req.user._id; // Use ObjectId instead of email

        console.log("Tasks:", tasksSet);
        console.log("Employees:", employeeSet);
        console.log("Managers:", managerSet);

        // Validate employeeSet: Check if all employees exist
        const existingEmployees = await EmployeeModel.find({ _id: { $in: employeeSet } });
        if (existingEmployees.length !== employeeSet.length) {
            res.status(400).json({ message: "Some employees in employeeSet do not exist.", success: false });
            return;
        }

        // Validate managerSet: Check if all managers exist
        const existingManagers = await UserModel.find({ _id: { $in: managerSet } });
        if (existingManagers.length !== managerSet.length) {
            res.status(400).json({ message: "Some managers in managerSet do not exist.", success: false });
            return;
        }
        

        // Convert `employeeSet` and `managerSet` to ObjectId references
        const validatedEmployees = employeeSet?.map((empId: string) => new mongoose.Types.ObjectId(empId)) || [];
        const validatedManagers = managerSet?.map((mgrId: string) => new mongoose.Types.ObjectId(mgrId)) || [];

        // Ensure tasks are embedded as objects (not ObjectId references)
        const validatedTasks = tasksSet?.map((task: any) => ({
            title: task.title,
            desc: task.desc,
            hrs_alloted: task.hrs_alloted,
            created_date: task.created_date,
            deadline_date: task.deadline_date,
            isDone: task.isDone,
            working_employ_id: task.working_employ_id?.map((empId: string) => new mongoose.Types.ObjectId(empId)) || []
        })) || [];

        const project = new ProjectModel({
            title,
            desc,
            created_date,
            deadline_date,
            created_by_manager,
            tasksSet: validatedTasks, // ✅ Store embedded task objects
            employeeSet: validatedEmployees,
            managerSet: validatedManagers
        });

        await project.save();

        res.status(201).json({
            message: `${title} has been created successfully.`,
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        });
    }
};

export const get_projects = async (req: Request, res: Response) => {
    try {
        const created_by_manager = req.user._id; // Use ObjectId instead of email

        const projects = await ProjectModel.find({ created_by_manager });

        if (!projects.length) {
            res.status(404).json({ message: "No projects found." });
            return;
        }

        res.status(200).json({ message: "Projects found successfully.", success: true, data: projects });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        });
    }
};

export const delete_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const created_by_manager = req.user._id;

        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({ message: "Valid Project ID is required." });
            return;
        }

        const project = await ProjectModel.findById(id);

        if (!project) {
            res.status(404).json({ message: "Project not found." });
            return;
        }

        // Authorization check
        if (project.created_by_manager.toString() !== created_by_manager.toString()) {
            res.status(403).json({ message: "You're not authorized to delete this project.", success: false });
            return;
        }

        await ProjectModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Project deleted successfully.", success: true });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        });
    }
};

export const update_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const updateData = req.body;
        const created_by_manager = req.user._id;

        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({ message: "Valid Project ID is required." });
            return;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Update data is required." });
            return;
        }

        const project = await ProjectModel.findById(id);

        if (!project) {
            res.status(404).json({ message: "Project not found." });
            return;
        }

        // Authorization check
        if (project.created_by_manager.toString() !== created_by_manager.toString()) {
            res.status(403).json({ message: "You're not authorized to update this project.", success: false });
            return;
        }

        // Prevent modification of `_id` or `created_by_manager`
        delete updateData._id;
        delete updateData.created_by_manager;

        // Convert `employeeSet`, `managerSet`, and `tasksSet` properly
        if (updateData.employeeSet) {
            updateData.employeeSet = updateData.employeeSet.map((empId: string) => new mongoose.Types.ObjectId(empId));
        }
        if (updateData.managerSet) {
            updateData.managerSet = updateData.managerSet.map((mgrId: string) => new mongoose.Types.ObjectId(mgrId));
        }
        if (updateData.tasksSet) {
            updateData.tasksSet = updateData.tasksSet.map((task: any) => ({
                title: task.title,
                desc: task.desc,
                hrs_alloted: task.hrs_alloted,
                created_date: task.created_date,
                deadline_date: task.deadline_date,
                isDone: task.isDone,
                working_employ_id: task.working_employ_id?.map((empId: string) => new mongoose.Types.ObjectId(empId)) || []
            }));
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Project updated successfully.", success: true, updatedProject });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        });
    }
};
