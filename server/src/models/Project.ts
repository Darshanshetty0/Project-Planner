import mongoose, { Schema, Document } from 'mongoose';
import { IUser, Employee, Project } from './types';

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    desc: { type: String },
    hrs_alloted: { type: Number, required: true, min: 1 }, // Ensure positive number
    date: { type: Date, required: false }, // Date of the task
    start_time: { type: Number, required: false, min: 0, max: 23 }, // Represents hour of the day (0-23)
    isDone: { type: Boolean, required: true },
    working_employ_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }] // References Employee model
});


const ProjectSchema: Schema = new Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    desc: { type: String },
    created_date: { type: Date, required: true },
    deadline_date: { type: Date, required: true },
    created_by_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming the User model is "User"
        required: true
    },
    tasksSet: [TaskSchema], // Embedded array of task objects ✅
    employeeSet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
    managerSet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const ProjectModel = mongoose.model<Document & Project>('Project', ProjectSchema);
export default ProjectModel;
