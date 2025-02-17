import { required } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

interface Task extends Document {
    id : string,
    title : string,
    desc : string,
    hrs_alloted : string,
    created_date: Date,
    deadline_date: Date,
    isDone: boolean,
    working_employ_id : [],
}

interface Project extends Document {
    title: string;
    desc: string;
    created_date: Date;
    deadline_date: Date;
    created_by_manager_email: string;
    id: string;
    tasksSet: Task[];
    employeeSet: [];
    managerSet: []; 
}

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
