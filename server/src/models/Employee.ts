import { string } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

interface Manager extends Document {
    manager_email: string;
}

interface Employee extends Document {
    name: string;
    created_by_manager_email: string; //check if exists //shouldnt be deletable
    created_date: Date;
    id: string; //unique
    holiday_calendar: string; //check if exists
    manager_set: Manager[]; //check if already exists in the list, if yes-> error
    shift_from: string;
    shift_to: string;
}

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
