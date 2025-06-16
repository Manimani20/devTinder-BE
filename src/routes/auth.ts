import express, { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../Models/User";
import { authMiddleware } from "../middlewares/authMiddleware";


export const authRouter = express.Router();

// SignUp API
authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "invalid email" });
      return;
    }
    try {
      const {password}= req.body;

      //hash the password before saving
      const hashedPassword = await bcrypt.hash(password,10);
    
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });
      const userData = await user.save();
      res
        .status(201)
        .json({ message: "User created successfully", data: userData });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ message: errorMessage });
    }
  }
);

// Login API
authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "invalid email" });
      return;
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
         res.status(404).json({ message: "invalid credentials" });
         return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user._id},"JWT_SECRET_KEY");
      res.cookie("token",token)
      res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ message: errorMessage });
    }
  }
)

// Logout API
authRouter.post(
  "/logout",authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ message: errorMessage });
    }
  }
);