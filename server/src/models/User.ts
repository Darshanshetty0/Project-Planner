import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './types';

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
