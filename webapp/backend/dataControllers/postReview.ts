import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../model/review.model";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

interface LoggedUser {
  email: string;
  name: string;
}

export const postReview: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Parse and validate the loggedUser header
    const loggedUserHeader = req.headers["loggedUser"];
    if (!loggedUserHeader) {
      res.status(401).json({ success: false, message: "User not authenticated." });
      return;
    }

    const loggedUser: LoggedUser = JSON.parse(loggedUserHeader as string); // Parse JSON string
    const { email: uEmail, name: uName } = loggedUser;

    // Extract feedback data from the request body
    const { entityId, comment, rating } = req.body;

    if (!entityId || !comment || !rating) {
      res.status(400).json({
        success: false,
        message: "Entity ID, comment, and rating are required.",
      });
      return;
    }

    const fid = uuidv4();

    const newFeedback = new feedbackModel({
      fid,
      entityId,
      uEmail,
      uName, // Include the user's name
      comment,
      rating,
      date: new Date(), // Current timestamp
    });

    await newFeedback.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Feedback posted successfully.",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error posting feedback:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while posting feedback.",
    });
  }
};
