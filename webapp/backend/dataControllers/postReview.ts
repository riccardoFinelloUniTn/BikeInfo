import { Request, Response, NextFunction, RequestHandler } from "express";
import feedbackModel from "../model/review.model";
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

    const existingReview = await feedbackModel.findOne({ entityId: eid, uEmail }).exec();

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

    const fid = uuidv4();

    const newFeedback = new feedbackModel({
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
    });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while posting review.",
    });
  }
};
