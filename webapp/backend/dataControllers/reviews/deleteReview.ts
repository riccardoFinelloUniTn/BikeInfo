import { Request, Response, NextFunction, RequestHandler } from "express";
import reviewModel from "../../model/review.model";
import entityModel from "../../model/entity.model";

export const deleteReview: RequestHandler = async (
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
    const deletedReview = await reviewModel.findOneAndDelete({ entityId: eid, uEmail }).exec();
    const entity = await entityModel.findOne({ eid: eid }).exec();
    if (!entity) {
      res.status(501).json({
        success: false,
        message: "Server can't find an entity with such ID",
      });
      return;
    }
    if (!deletedReview) {
      res.status(404).json({
        success: false,
        message: "Review not found for this entity by the logged-in user.",
      });
      return;
    }
    if (entity.reviews > 1) {
      entity.rating = ((entity.rating * entity.reviews - deletedReview.rating) / (entity.reviews - 1));
      entity.reviews -= 1;
    } else {
      entity.rating = 0;
      entity.reviews = 0;
    }
    entity.save();
    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
      deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the review.",
    });
  }
};