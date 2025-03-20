import { Request, Response } from "express";
import CalendarModel from "../models/Calendar";
import UserModel from "../models/User";
import mongoose from "mongoose";

export const add_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, year, holidays } = req.body;
        const created_by_manager = req.user._id;

        console.log("Received created_by_manager:", created_by_manager);

        if (!mongoose.Types.ObjectId.isValid(created_by_manager)) {
            res.status(400).json({ message: "Invalid manager ID format.", success: false });
            return;
        }

        const isManagerExisting = await UserModel.findById(created_by_manager);
        console.log("Manager Found:", isManagerExisting);

        if (!isManagerExisting) {
            res.status(404).json({ message: "Manager not found.", success: false });
            return;
        }

        const calendar = new CalendarModel({ title, created_by_manager, year, holidays});
        await calendar.save();

        res.status(201).json({ message: `${title} has been created`, success: true, calendar });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: err.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};


export const get_calendar = async (req: Request, res: Response) => {
    try {
        const created_by_manager = req.user;

        if (!created_by_manager) {
            res.status(400).json({ error: "Valid manager ID is required." });
            return;
        }

        if (req.query.id) {
            const calendarID = req.query.id as string;
            const calendar = await CalendarModel.findOne({ _id: calendarID, created_by_manager: created_by_manager._id});

            if (!calendar) {
                res.status(404).json({ message: "No calendar found." });
                return;
            }
            res.status(200).json(calendar);
        } else {
            const calendars = await CalendarModel.find({ created_by_manager });

            if (!calendars.length) {
                res.status(404).json({ message: "No calendars found." });
                return;
            }
            res.status(200).json({calendars: calendars, userInfo: created_by_manager});
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

export const update_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query; // Get the calendar ID from URL
        const updateData = req.body; // Use request body directly
        const manager_id = req.user._id; // Extract correct manager ID

        console.log("Received Update Request for Calendar:", id);
        console.log("Manager ID:", manager_id);
        console.log("Update Data:", updateData);

        if (!id) {
            res.status(400).json({ message: "Calendar ID is required." });
            return;
        }

        // Ensure manager_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(manager_id)) {
            res.status(400).json({ message: "Invalid manager ID format.", success: false });
            return;
        }

        // Find the existing calendar
        const calendar = await CalendarModel.findOne({ _id:id });

        if (!calendar) {
            res.status(404).json({ message: "Calendar not found." });
            return;
        }

        console.log("Found Calendar:", calendar);

        // Ensure the user is authorized to update
        if (calendar.created_by_manager.toString() !== manager_id.toString()) {
            res.status(403).json({ message: "You're not authorized to update this calendar." });
            return;
        }

        // Remove `id` & `_id` from updateData to prevent MongoDB errors

        console.log("Final Update Data:", updateData);

        // Perform the update
        const updatedCalendar = await CalendarModel.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCalendar) {
            res.status(500).json({ message: "Failed to update calendar." });
            return;
        }

        console.log("Updated Calendar:", updatedCalendar);

        res.status(200).json({
            message: "Calendar updated successfully.",
            success: true,
            updatedCalendar
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error updating calendar:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};


export const delete_calendar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const manager_id = req.user._id;

        if (!id) {
            res.status(400).json({ message: "Calendar ID is required." });
            return;
        }

        const calendar = await CalendarModel.findOne({ _id: id });

        if (!calendar) {
            res.status(404).json({ message: "Calendar not found." });
            return;
        }

        if (calendar.created_by_manager.toString() !== manager_id) {
            res.status(403).json({ message: "You're not authorized to delete this calendar." });
            return;
        }

        await CalendarModel.findOneAndDelete({ _id:id });

        res.status(200).json({ message: "Calendar deleted successfully.", success: true });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};
