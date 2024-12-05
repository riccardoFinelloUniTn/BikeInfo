import { pbkdf2Sync } from "crypto";
import dotenv from "dotenv";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model";

dotenv.config();

// Helper function to verify password
function verifyPassword(enteredPassword: string, salt: string, hash: string): boolean {
  const hashedPassword = pbkdf2Sync(enteredPassword, salt, 1000, 64, 'sha512').toString('hex');
  return hashedPassword === hash;
}

 export const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "Authentication failed. Body not found." });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Authentication failed. Email and password are required." });
    return;
  }

  try {
    
    const user = await userModel.findOne({ email }).exec();


    if (!user) {
      res.status(404).json({ success: false, message: "Authentication failed. User not found." });
      return;
    }

    // Check if password matches using salt and hash
    if (!verifyPassword(password, user.salt, user.password)) {
      res.status(401).json({ success: false, message: "Authentication failed. Wrong password." });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, name: user.name + " " + user.surname },
      process.env.SUPER_SECRET!,
      { expiresIn: 86400 } // Token validity (24 hours)
    );



    res.status(200).json({ success: true, message: "Authentication successful!", token });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ success: false, message: "An error occurred while processing authentication." });
    //TODO manca next()
  }
};
