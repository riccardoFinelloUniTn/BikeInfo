import { Request, Response, NextFunction, RequestHandler } from "express";
import entityModel from "../../model/entity.model";

export const getCentroInBici: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
  
      // Fetch reviews by the entity ID
      const centroInBici = await entityModel.find({ type: "centroInBici" }).exec();
  
      if (centroInBici.length === 0) {
        res.status(404).json({
          success: false,
          message: "No centro in bici found.",
        });
        return;
      }
  
      // Send response with found reviews
      res.status(200).json({
        success: true,
        data: centroInBici,
      });
    } catch (error) {
      console.error("Error fetching centro in bici:", error);
      next(error); // Passes error to Express’s error handler
    }
  };

  export default getCentroInBici;