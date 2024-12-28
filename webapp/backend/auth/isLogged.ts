import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const isLoggedIn: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      loggedIn: false, 
      message: 'No token provided' 
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SUPER_SECRET as string);
    res.status(200).json({ 
      loggedIn: true, 
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ 
      loggedIn: false, 
      message: 'Invalid or expired token' 
    });
  }
};
