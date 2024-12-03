import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

interface DecodedToken {
  email: string;
  name: string;
}

export const tokenChecker = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Authorization token is missing.",
    });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract token from Bearer scheme
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Invalid token format.",
    });
    return;
  }

  jwt.verify(token, process.env.SUPER_SECRET!, (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Failed to authenticate token.",
      });
      return;
    }

    // Attach decoded payload (e.g., email and name) to the request object
    const { email, name } = decoded as DecodedToken; // Explicit type cast
    req.headers["loggedUser"] = JSON.stringify({ email, name }); // Store as JSON string

    next();
  });
};

export default tokenChecker;
