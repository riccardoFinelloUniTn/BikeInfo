import { Request, Response, NextFunction, RequestHandler } from "express";
import reviewModel from "../../model/review.model";
import entityModel from "../../model/entity.model";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

interface LoggedUser {
  email: string;
  name: string;
}

export const postReview: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { eid } = req.params;

    // Parse and validate the loggedUser header
    const loggedUser = req.headers.loggedUser as string;
    if (!loggedUser) {
      res.status(401).json({ success: false, message: "Unauthorized. User not logged in." });
      return;
    }

    const { email: uEmail, name: uName } = JSON.parse(loggedUser);

    // Extract feedback data from the request body
    
    const {comment, rating } = req.body;

    if (!eid || !comment || !rating) {
      res.status(400).json({
        success: false,
        message: "Entity ID, comment, and rating are required.",
      });
      return;
    }

    const existingReview = await reviewModel.findOne({ entityId: eid, uEmail }).exec();

    const entity = await entityModel.findOne({eid: eid}).exec();

    if(!entity){
      res.status(501).json({
        success: false,
        message: "Server can't find an entity with such ID",
      });
      return;
    }

    console.log(eid + uEmail + existingReview);
    if (existingReview) {
      res.status(409).json({
        success: false,
        message: "You have already submitted a review for this entity.",
      });
      return;
    }
    

    if(rating < 1 || rating > 5){
      res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5, given " + rating,
      });
      return;
    }

    let oldReviews = Number(entity.reviews);
    let oldRating = Number(entity.rating);
    let newRating = Number(rating);

    if (isNaN(oldReviews) || isNaN(oldRating) || isNaN(newRating)) {
      console.error("Invalid number detected", { oldReviews, oldRating, newRating });
      res.status(500).json({ success: false, message: "Server error: Invalid rating values." });
      return;
    }

    if (oldReviews === 0) {
      entity.rating = newRating;
    } else {
      entity.rating = ((oldRating * oldReviews) + newRating) / (oldReviews + 1);
    }

    entity.reviews = oldReviews + 1;

    console.log(`Updated rating: ${entity.rating} = (${oldRating} * ${oldReviews} + ${newRating}) / (${oldReviews + 1})`);

    await entity.save();

    const fid = uuidv4();

    

    const newFeedback = new reviewModel({
      fid,
      entityId: eid,
      uEmail,
      uName,
      comment,
      rating,
      date: new Date(), // Current timestamp
    });

    await newFeedback.save();



    // Respond with success
    res.status(201).json({
      success: true,
      message: "Review posted successfully.",
      feedback: newFeedback,
      entity: entity
    });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while posting review.",
    });
  }
};
