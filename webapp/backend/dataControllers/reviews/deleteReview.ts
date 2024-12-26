import { Request, Response, NextFunction, RequestHandler } from "express";
import reviewModel from "../../model/review.model";

export const deleteReview: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eid } = req.params;

    // Parse and validate the loggedUser header
    const loggedUser = req.headers.loggedUser as string;
    if (!loggedUser) {
      res.status(401).json({ success: false, message: "Unauthorized. User not logged in." });
      return;
    }

    const { email: uEmail } = JSON.parse(loggedUser);

    // Find and delete the review
    const deletedReview = await reviewModel.findOneAndDelete({ entityId: eid, uEmail }).exec();

    if (!deletedReview) {
      res.status(404).json({
        success: false,
        message: "Review not found for this entity by the logged-in user.",
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
      deletedReview,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the review.",
    });
  }
};
