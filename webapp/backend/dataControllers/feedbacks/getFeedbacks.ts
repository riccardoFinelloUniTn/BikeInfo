import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../../model/feedback.model";

export const getFeedbacksByEntityId: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eid } = req.params;

    // Validate entity ID
    if (!eid) {
      res.status(400).json({ success: false, message: "Entity ID is required." });
      return;
    }

    // Extract logged user from the middleware
    const loggedUser = req.headers["loggedUser"] as any;

    if (!loggedUser) {
      res.status(403).json({ success: false, message: "Access denied. User not authenticated." });
      return;
    }

    const { email: userEmail, role } = loggedUser;

    // Fetch feedbacks by entity ID
    const feedbacks = await feedbackModel.find({ entityId: eid }).exec();

    // Filter feedbacks based on ownership or admin role
    const authorizedFeedbacks = feedbacks.filter(
      (feedback) => feedback.uEmail === userEmail || role === "admin"
    );

    if (authorizedFeedbacks.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to view these feedbacks.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      feedbacks: authorizedFeedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching feedbacks." });
  }
};
