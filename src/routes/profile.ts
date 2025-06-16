import express from 'express';
import bcrypt from "bcrypt";
import { User } from "../Models/User";
import { authMiddleware } from '../middlewares/authMiddleware';

export const profileRouter = express.Router();

//Get User Profile API
profileRouter.get("/view",
    authMiddleware,
    async (req:any,res:any): Promise<void> => {
       try{
        const user = req.user;
        res.status(200).json({
            message: "User profile fetched successfully",
            data:user
        });
       }catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        res.status(400).json({ message: errorMessage });
        return;
       }
    }
);

//update User Profile API
profileRouter.patch(
    "/edit",
    authMiddleware,
    async (req: any, res: any): Promise<void> => {
        const updatableFields = ['firstName', 'lastName', 'gender', 'age', 'mobile', 'skills', 'photoUrl','about'];
        const userData = req.body;
        const isValidUpdate = Object.keys(userData).every((key) => updatableFields.includes(key));
        if (!isValidUpdate) {
            res.status(400).json({ message: "Invalid update fields" });
            return;
        }
        const user= req.user;

        try {
            Object.keys(userData).forEach((key) =>user[key] = userData[key]);
            const updatedUser=await user.save();
            res.status(200).json({
                message: "Profile updated successfully",
                data: updatedUser
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            res.status(400).json({ message: errorMessage });
        }
    }
)

//Forgot Password API
profileRouter.patch(
    "/resetPassword",
    authMiddleware,
    async (req: any, res: any): Promise<void> => {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Old password and new password are required" });
            return;
        }

        try {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Old password is incorrect" });
                return;
            }
            user.password = await bcrypt.hash(newPassword, 10); // Hash the new password
            await user.save();
            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            res.status(400).json({ message: errorMessage });
        }
    })