// controllers/reviewController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import reviewModel from "../../model/review.model";

// Handler function to fetch reviews by entity ID
export const getReviewsByEntityId: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eid } = req.params;

    if (!eid) {
      res.status(400).json({
        success: false,
        message: "Entity ID is required.",
      });
      return;
    }

    // Fetch reviews by the entity ID
    const reviews = await reviewModel.find({ entityId: eid }).exec();

    if (reviews.length === 0) {
      res.status(404).json({
        success: false,
        message: "No reviews found for the given entity.",
      });
      return;
    }

    // Send response with found reviews
    res.status(200).json({
      success: true,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error); // Passes error to Express’s error handler
  }
};
