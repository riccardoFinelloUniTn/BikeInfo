import { Request, Response, RequestHandler } from 'express';
import userModel from '../model/user.model';
import { savePassword } from '../auth/hash';
import { v4 as uuidv4 } from 'uuid';


export const registerUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password } = req.body;

    // Validate required fields
    if (!email || !password || !name || !surname) {
      res.status(400).json({
        success: false,
        message: "Name, surname, email, and password are required.",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email }).exec();
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists.",
      });
      return;
    }

    // Generate user data
    const uid = uuidv4();
    const { salt, hash } = savePassword(password);

    // Create and save new user
    const newUser = new userModel({
      uid,
      name,
      surname,
      email,
      password: hash,
      salt,
      role: "user"
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the user.",
    });
  }
};
