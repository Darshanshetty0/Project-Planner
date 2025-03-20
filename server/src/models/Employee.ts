import mongoose, { Schema, Document } from "mongoose";

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    created_by_manager: {
        type: mongoose.Schema.Types.ObjectId, // ✅ Should be ObjectId
        ref: "User", // ✅ Reference to User model
        required: true,
    },
    created_date: {
        type: Date,
        required: true,
    },
    holiday_calendar: {
        type: mongoose.Schema.Types.ObjectId, // ✅ Should be ObjectId
        ref: "Calendar",
        required: true
    },
    manager_set: [{
        type: mongoose.Schema.Types.ObjectId, // ✅ Must be an array of ObjectId
        ref: "User"
    }],
    shift_from: {
        type: String,
        required: true
    },
    shift_to: {
        type: String,
        required: true
    }
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
export default EmployeeModel;
