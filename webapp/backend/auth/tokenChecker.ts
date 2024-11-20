import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const tokenChecker = (req: Request, res: Response, next: NextFunction): void => {
  if (!req) {
    return;
  }

  // Check header or URL parameters or post parameters for token
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Bearer scheme

  // If there is no token
  if (!token) {
    res.status(401).json({
      success: false,
      message: "No token provided.",
    });
    return;
  }

  // Decode token, verify secret, and check expiration
  jwt.verify(token, process.env.SUPER_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Failed to authenticate token.",
      });
      return;
    }

    // If everything is good, attach the decoded token to the request object
    req.headers["loggedUser"] = decoded as string; // Decoded payload (ensure type safety if needed)
    next();
  });
};

export default tokenChecker;
