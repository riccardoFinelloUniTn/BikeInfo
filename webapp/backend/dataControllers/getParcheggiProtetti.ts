import { Request, Response, NextFunction, RequestHandler } from "express";
import entityModel from "../model/entity.model";

export const getParcheggiProtetti: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
  
      // Fetch reviews by the entity ID
      const parcheggiProtetti = await entityModel.find({ type: "parcheggioProtetto" }).exec();
  
      if (parcheggiProtetti.length === 0) {
        res.status(404).json({
          success: false,
          message: "No parcheggiProtetti found.",
        });
        return;
      }
  
      // Send response with found reviews
      res.status(200).json({
        success: true,
        data: parcheggiProtetti,
      });
    } catch (error) {
      console.error("Error fetching parcheggiProtetti:", error);
      next(error); // Passes error to Express’s error handler
    }
  };

  export default getParcheggiProtetti;