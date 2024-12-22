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
      const { eid } = req.params;
  
      const loggedUser = req.headers.loggedUser as string;
      if (!loggedUser) {
        res.status(401).json({ success: false, message: "Unauthorized. User not logged in." });
        return;
      }
  
      const { email: uEmail } = JSON.parse(loggedUser);
  
      // Find and delete the feedback
      const deletedFeedback = await feedbackModel.findOneAndDelete({ entityId: eid, uEmail }).exec();
  
      if (!deletedFeedback) {
        res.status(404).json({
          success: false,
          message: "Review not found for this entity by the logged-in user.",
        });
        return;
      }
      
      //success
      res.status(200).json({
        success: true,
        message: "Feedback deleted successfully.",
        deleteFeedback,
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the feedback.",
      });
    }
  };