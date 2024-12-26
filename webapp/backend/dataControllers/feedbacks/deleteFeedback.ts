import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../../model/feedback.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const deleteFeedback: RequestHandler = async (
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

    // Verify the token
    const secretKey = process.env.SUPER_SECRET!;
    let decoded: any;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      res.status(403).json({ success: false, message: "Failed to authenticate token." });
      return;
    }

    const uEmail = decoded.email;

    const { fid } = req.params;

    if (!fid) {
      res.status(400).json({ success: false, message: "Feedback ID is required." });
      return;
    }

    const feedback = await feedbackModel.findOne({ fid }).exec();

    if (!feedback) {
      res.status(404).json({ success: false, message: "Feedback not found." });
      return;
    }

    if (feedback.uEmail !== uEmail) {
      res.status(403).json({ success: false, message: "Unauthorized to delete this feedback." });
      return;
    }

    await feedbackModel.deleteOne({ fid }).exec();

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting feedback.",
    });
  }
};
