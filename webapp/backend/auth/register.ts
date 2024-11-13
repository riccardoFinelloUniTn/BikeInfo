import { Request, Response, NextFunction, RequestHandler } from "express";
import userModel from "../model/user.model"; // Import the User model
import { savePassword } from "./hash"; // Import the password hashing function

export const registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email }).exec();
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists.",
      });
      return;
    }

    // Hash password
    const { salt, hash } = savePassword(password);

    // Create and save new user
    const newUser = new userModel({ email, salt, hash });
    await newUser.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    next(error);
  }
};