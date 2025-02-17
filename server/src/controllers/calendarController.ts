import { Request, Response } from "express";
import CalendarModel from "../models/Calendar";
import UserModel from "../models/User";

export const add_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, year, id } = req.body;
        const created_by_manager_email = req.user.email;


        const calendar = await CalendarModel.findOne({ id });
        if (calendar) {
            res.status(409).json({message: 'Calendar with the same ID already exists. Please go for a differnt ID', success: false});
            return;
        }
        const isManagerExisting = await UserModel.findOne({ email: created_by_manager_email });
        if (!isManagerExisting) {
            res.status(409).json({message: 'There are no managers with this email. Please try again with a valid Manager email', success: false});
            return;
        }
        const calendarModel = new CalendarModel({title, created_by_manager_email, year, id});
        await calendarModel.save();

        res.status(201).json({
            message: title + ' has been created',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const get_calendar = async (req: Request, res: Response) => {
    try {
        if(req.user){
            try {
                const created_by_manager_email = req.user.email;

                if (!created_by_manager_email) {
                    res.status(400).json({ error: "Valid email is required" });
                    return;
                }

                if(req.query.id){
                    try {
                        const calendarID = req.query.id;
                        if (!calendarID) {
                            res.status(400).json({ error: "Valid ID is required" });
                            return;
                        }
                
                        console.log("Fetching calendars having id: ", calendarID);
                
                        const calendars = await CalendarModel.findOne({ id: calendarID, created_by_manager_email: created_by_manager_email});
                
                        if (!calendars) {
                            res.status(404).json({ message: "No calendars found" });
                            return;
                        }
                        res.status(200).json(calendars);
                    } catch (error) {
                        console.error(`Error fetching the calendar with ID: ${req.query.id}`, error);
                        res.status(500).json({ error: "Internal Server Error" });
                    }
                }

                if(!req.query.id){
                    console.log("Fetching calendars for:", created_by_manager_email);
        
                    const calendars = await CalendarModel.find({ created_by_manager_email });
            
                    if (!calendars.length) {
                        res.status(404).json({ message: "No calendars found" });
                        return;
                    }
                    res.status(200).json(calendars);
                }
            } catch (error) {
                console.error("Error fetching calendars:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    } catch {
        console.error(`Error fetching the calendar: ${req.query}`, Error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const created_by_manager_email = req.user.email;
        const { id } = req.query; // Get the calendar ID from URL
        const updateData = req.body.updateData; // Get update data from request body

        if (!id) {
            res.status(400).json({ message: "Calendar ID is required." });
            return;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Update data is required." });
            return;
        }

        // Find the existing calendar
        const calendar = await CalendarModel.findOne({ id });

        if (!calendar) {
            res.status(404).json({ message: "Calendar not found." });
            return;
        }

        if (calendar.created_by_manager_email !== created_by_manager_email) {
            res.status(403).json({ message: "You're not authorized to update this calendar." });
            return;
        }

        // Update the calendar
        try {
            const updatedCalendar = await CalendarModel.findOneAndUpdate(
                { id }, 
                updateData, 
                { new: true }
            );
            res.status(200).json({
                message: "Calendar updated successfully.",
                success: true,
                updatedCalendar
            });
        } catch (error) {
            console.error("Error updating calendar:", error);
            res.status(500).json({ message: "Internal Server Error", error });
        }

    } catch (error) {
        console.error("Error updating calendar:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


export const delete_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({ message: "Calendar ID is required." });
            return;
        }

        const deletedProject = await CalendarModel.findOneAndDelete({ id });
        if (!deletedProject) {
            res.status(404).json({ message: "Project not found." });
            return;
        }

        res.status(200).json({ message: "Project deleted successfully.", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

