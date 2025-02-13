import mongoose, { Schema, Document } from 'mongoose';

interface Task extends Document {
    id : string,
    title : string,
    desc : string,
    hrs_alloted : string,
    working_employ_id : [],
}

interface Project extends Document {
    title: string;
    created_by_manager_email: string;
    year: number;
    id: string;
    holidays: Task[]; 
}

const CalendarSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    created_by_manager_email: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    holidays: {
        type: Array,
        required: false
    }
});

const CalendarModel = mongoose.model<Calendar>('Calendar', CalendarSchema);
export default CalendarModel;
