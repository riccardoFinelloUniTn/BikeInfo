import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../../model/feedback.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const patchFeedbackAnswer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ success: false, message: "Authorization token is missing." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Invalid token format." });
      return;
    }

    const secretKey = process.env.SUPER_SECRET!;
    let decoded: any;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      res.status(403).json({ success: false, message: "Failed to authenticate token." });
      return;
    }

    // Check if the user is an admin
    const userRole = decoded.role;
    if (userRole !== "admin") {
      res.status(403).json({ success: false, message: "Unauthorized. Only admins can update answers." });
      return;
    }

    const { fid } = req.params;
    const { answer } = req.body;

    if (!fid || !answer) {
      res.status(400).json({ success: false, message: "Feedback ID and answer are required." });
      return;
    }

    const feedback = await feedbackModel.findOne({ fid }).exec();

    if (!feedback) {
      res.status(404).json({ success: false, message: "Feedback not found." });
      return;
    }

    feedback.answer = answer;
    await feedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback answer updated successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Error updating feedback answer:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating feedback answer.",
    });
  }
};
