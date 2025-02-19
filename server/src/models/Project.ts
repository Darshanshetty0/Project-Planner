import mongoose, { Schema, Document } from 'mongoose';
import { Project } from './types';
const ProjectSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    created_date:{
        type: Date,
        required: true,
    },
    deadline_date:{
        type: Date,
        required: true,
    },
    created_by_manager_email: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    tasksSet: {
        type: Array,
        required: false
    },
    employeeSet: {
        type: Array,
        required: false
    },
    managerSet: {
        type: Array,
        required: false
    }
});

const ProjectModel = mongoose.model<Project>('Projects', ProjectSchema);
export default ProjectModel;
