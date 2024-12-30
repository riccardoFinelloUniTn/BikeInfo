import { Request, Response, NextFunction, RequestHandler } from "express";
import reviewModel from "../../model/review.model";
import entityModel from "../../model/entity.model";


export const patchReview: RequestHandler = async (
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

    const { comment, rating } = req.body;

    if (!eid || (!comment && !rating)) {
      res.status(400).json({
        success: false,
        message: "Entity ID and at least one field (comment or rating) to update are required.",
      });
      return;
    }

    if (rating && (rating < 1 || rating > 5)) {
      res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
      return;
    }

    // Find the review to update
    const existingReview = await reviewModel.findOne({ entityId: eid, uEmail }).exec();

    const entity = await entityModel.findOne({eid: eid}).exec();
    
    if(!entity){
      res.status(501).json({
        success: false,
        message: "Server can't find an entity with such ID",
      });
      return;
    }


    if (!existingReview) {
      res.status(404).json({
        success: false,
        message: "Review not found for this entity by the logged-in user.",
      });
      return;
    }

    const oldRating = existingReview.rating;

    // Update the fields
    if (comment) existingReview.comment = comment;
    if (rating) existingReview.rating = rating;

    entity.rating = ((entity.rating * entity.reviews - oldRating + rating) / entity.reviews)

    existingReview.date = new Date();

    await existingReview.save();
    await entity.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      updatedReview: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the review.",
    });
  }
};