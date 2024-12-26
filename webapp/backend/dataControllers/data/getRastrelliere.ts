import { Request, Response, NextFunction, RequestHandler } from "express";
import entityModel from "../../model/entity.model";

export const getRastrelliere: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
  
      // Fetch reviews by the entity ID
      const rastrelliere = await entityModel.find({ type: "rastrelliera" }).exec();
  
      if (rastrelliere.length === 0) {
        res.status(404).json({
          success: false,
          message: "No rastrelliere found.",
        });
        return;
      }
  
      // Send response with found reviews
      res.status(200).json({
        success: true,
        data: rastrelliere,
      });
    } catch (error) {
      console.error("Error fetching ratsrelliere:", error);
      next(error); // Passes error to Express’s error handler
    }
  };

  export default getRastrelliere;