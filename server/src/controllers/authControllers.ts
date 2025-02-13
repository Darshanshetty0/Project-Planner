import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserModel from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(409).json({ message: 'User already exists, you can login instead', success: false });
            return;
        }

        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(403).json({ message: 'Auth failed. Password or email wrong!', success: false });
            return;
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            res.status(403).json({ message: 'Auth failed. Password or email wrong!', success: false });
            return;
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
