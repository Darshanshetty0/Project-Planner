import { string } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';
import { Employee } from './types';

const EmployeeSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    created_by_manager_email: {
        type: String,
        required: true,
    },
    created_date: { //do not take system date, figure out something else
        type: Date,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    holiday_calendar: {
        type: String,
        required: true
    },
    manager_set: {
        type: Array,
        required: true
    },
    shift_from: {
        type: String,
        required: true
    },
    shift_to: {
        type: String,
        required: true
    }
});

const EmployeeModel = mongoose.model<Employee>('Employee', EmployeeSchema);
export default EmployeeModel;
