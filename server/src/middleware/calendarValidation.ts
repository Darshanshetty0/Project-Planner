import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const calendarValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        year: Joi.number().integer().min(2000).max(2050).required(),
        holidays: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().min(3).max(100).required(),
                    date: Joi.date().iso().required() // Ensures it's a valid ISO date
                })
            )
            .optional()
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
