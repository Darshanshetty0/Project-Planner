import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


const validateProject = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().optional(),
        created_date: Joi.date().required(),
        deadline_date: Joi.date().required(),
        created_by_manager_email: Joi.string().optional(),
        id: Joi.string().required(),
        tasksSet: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                title: Joi.string().required(),
                desc: Joi.string().optional(),
                hrs_alloted: Joi.string().required(),
                created_date: Joi.date().required(),
                deadline_date: Joi.date().required(),
                isDone: Joi.boolean().required(),
                working_employ_id: Joi.array().items(Joi.string()).optional()
            })
        ).optional(),
        employeeSet: Joi.array().items(Joi.string()).optional(),
        managerSet: Joi.array().items(Joi.string()).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ errors: error.details.map(err => err.message) });
        return;
    }
    next();
};

export default validateProject;
