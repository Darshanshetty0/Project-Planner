import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const employeeValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        created_by_manager: Joi.string().hex().length(24).optional(), // MongoDB ObjectId validation
        created_date: Joi.date().iso().required(),
        holiday_calendar: Joi.string().hex().length(24).required(), // ObjectId reference to Calendar
        manager_set: Joi.array()
            .items(Joi.string().hex().length(24)) // Ensure all manager IDs are valid ObjectIds
            .unique() // Prevent duplicate entries
            .optional(),
        shift_from: Joi.string().required(),
        shift_to: Joi.string().required(),
        selfManage: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({ 
            message: "Bad request", 
            errors: error.details.map(err => err.message) // Extract meaningful error messages
        });
        return;
    }
    next();
};
