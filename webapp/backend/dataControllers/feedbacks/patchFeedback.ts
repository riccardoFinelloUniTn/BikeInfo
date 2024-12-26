import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../../model/feedback.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const patchFeedback: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const uEmail = decoded.email;

    // Extract feedback ID and update data from the request
    const { fid } = req.params; // Feedback ID passed as a URL parameter
    const { comment } = req.body;

    if (!fid || !comment) {
      res.status(400).json({
        success: false,
        message: "Feedback ID and updated comment are required.",
      });
      return;
    }

    // Find the feedback by ID and verify ownership
    const feedback = await feedbackModel.findOne({ fid }).exec();

    if (!feedback) {
      res.status(404).json({ success: false, message: "Feedback not found." });
      return;
    }

    if (feedback.uEmail !== uEmail) {
      res.status(403).json({ success: false, message: "Unauthorized to update this feedback." });
      return;
    }

    feedback.comment = comment;
    feedback.date = new Date();

    await feedback.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Feedback updated successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating feedback.",
    });
  }
};
