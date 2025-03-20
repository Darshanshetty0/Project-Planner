import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validateProject = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        desc: Joi.string().optional(),
        created_date: Joi.date().iso().required(),
        deadline_date: Joi.date().iso().required(),
        tasksSet: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().min(3).max(100).required(),
                    desc: Joi.string().optional(),
                    hrs_alloted: Joi.number().positive().required(), // Ensure positive number
                    date: Joi.date().iso().optional(), // Represents the task's actual date
                    start_time: Joi.number().integer().min(0).max(23).optional(), // Ensures start_time is within 0-23
                    isDone: Joi.boolean().required(),
                    working_employ_id: Joi.array()
                        .items(Joi.string().hex().length(24)) // ObjectId references to Employee
                        .default([]) // Default to an empty array if missing
                })
            )
            .default([]), // Ensure tasksSet defaults to an empty array if missing
        employeeSet: Joi.array()
            .items(Joi.string().hex().length(24)) // ObjectId references to Employee
            .default([]),
        managerSet: Joi.array()
            .items(Joi.string().hex().length(24)) // ObjectId references to IUser
            .default([])
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({ 
            message: "Bad request", 
            errors: error.details.map(err => err.message) // Extract meaningful validation messages
        });
        return;
    }
    next();
};

export default validateProject;