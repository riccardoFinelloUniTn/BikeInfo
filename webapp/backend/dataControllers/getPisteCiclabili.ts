import { Request, Response, NextFunction, RequestHandler } from "express";
import entityModel from "../model/entity.model";

export const getPisteCiclabili: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
  
      // Fetch reviews by the entity ID
      const pisteCiclabili = await entityModel.find({ type: "pistaCiclabile" }).exec();
  
      if (pisteCiclabili.length === 0) {
        res.status(404).json({
          success: false,
          message: "No piste ciclabili found.",
        });
        return;
      }
  
      // Send response with found reviews
      res.status(200).json({
        success: true,
        data: pisteCiclabili,
      });
    } catch (error) {
      console.error("Error fetching pisteCiclabili:", error);
      next(error); // Passes error to Express’s error handler
    }
  };

  export default getPisteCiclabili;