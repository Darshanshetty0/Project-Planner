import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const calendarValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        year: Joi.number().min(2000).max(2050).required(),
        id: Joi.string().min(4).required(),
        holidays: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().min(3).max(100).required(),
                date: Joi.string().isoDate().required() // Ensures it's an ISO date string
            })
        )
        .optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Bad request", error });
        return;
    }
    next();
};