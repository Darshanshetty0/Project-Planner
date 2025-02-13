import mongoose, { Schema, Document } from 'mongoose';

interface Holiday extends Document {
    title: string;
    date: Date;
}

interface Calendar extends Document {
    title: string;
    created_by_manager_email: string;
    year: number;
    id: string;
    holidays: Holiday[]; 
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
