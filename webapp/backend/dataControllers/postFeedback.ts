import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../model/feedback.model";
import jwt from "jsonwebtoken";

export const postFeedback: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ success: false, message: "Authorization token is missing." });
      return;
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      res.status(401).json({ success: false, message: "Invalid token format." });
      return;
    }

    // Verify the token
    const secretKey = process.env.SUPER_SECRET!;
    let decoded: any;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      res.status(403).json({ success: false, message: "Failed to authenticate token." });
      return;
    }

    // Extract user email from the token payload
    const userEmail = decoded.email;

    // Extract feedback data from the request body
    const { entityId, content, rating } = req.body;
    if (!entityId || !content || typeof rating !== "number") {
      res.status(400).json({ success: false, message: "Entity ID, content, and rating are required." });
      return;
    }

    // Save the feedback to the database
    const newFeedback = new feedbackModel({
      entityId,
      uemail: userEmail,
      content,
      rating,
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
