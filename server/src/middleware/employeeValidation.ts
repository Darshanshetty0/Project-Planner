import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const employeeValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        authorization: Joi.string().required(),
        created_date: Joi.date().iso().required(),
        id: Joi.string().min(4).required(),
        holiday_calendar: Joi.string().min(3).max(100).required(),
        manager_set: Joi.array().optional(),
        shift_from: Joi.string().required(),
        shift_to: Joi.string().required(),
        selfManage: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Bad request", error: error.details });
        return;
    }
    next();
};
