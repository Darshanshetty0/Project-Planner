import mongoose, { Schema, Document } from 'mongoose';
import { Calendar } from './types';

const HolidaySchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const CalendarSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    created_by_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User model name is "User"
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    holidays: [HolidaySchema] // Embedded array of holiday objects
}, { timestamps: true });

const CalendarModel = mongoose.model<Document & Calendar>('Calendar', CalendarSchema);
export default CalendarModel;
