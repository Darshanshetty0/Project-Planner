import { Request, Response } from "express";
import ProjectModel from "../models/project";

export const add_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, desc, created_date, deadline_date, id } = req.body;
        const created_by_manager_email = req.user.email;

        const existingProject = await ProjectModel.findOne({ id });
        if (existingProject) {
            res.status(409).json({ message: "Project with the same ID already exists.", success: false });
            return;
        }

        const project = new ProjectModel({ title, desc, created_date, deadline_date, created_by_manager_email, id });
        await project.save();

        res.status(201).json({
            message: `${title} has been created`, 
            success: true 
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

export const get_projects = async (req: Request, res: Response) => {
    try {
        const created_by_manager_email = req.user.email;

        const projects = await ProjectModel.find({ created_by_manager_email });
        if (!projects.length) {
            res.status(404).json({ message: "No projects found" });
            return;
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const delete_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({ message: "Project ID is required." });
            return;
        }

        const deletedProject = await ProjectModel.findOneAndDelete({ id });
        if (!deletedProject) {
            res.status(404).json({ message: "Project not found." });
            return;
        }

        res.status(200).json({ message: "Project deleted successfully.", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const update_project = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const updateData = req.body;

        if (!id) {
            res.status(400).json({ message: "Project ID is required." });
            return;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Update data is required." });
            return;
        }

        const updatedProject = await ProjectModel.findOneAndUpdate(
            { id },
            updateData,
            { new: true }
        );

        if (!updatedProject) {
            res.status(404).json({ message: "Project not found." });
            return;
        }

        res.status(200).json({ message: "Project updated successfully.", success: true, updatedProject });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
