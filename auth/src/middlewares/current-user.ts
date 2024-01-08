import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
};

// reach into the existing Request interface and add in currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// if logged in, extract data from payload and set it as currentUser property
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // return the next middlewear for current user is no jwt exists
  if (!req.session?.jwt) {
    return next();
  };

  try {
    // decode the jwt, app check will prevent this env from ever being empty
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    // setting currentUser on the request
    req.currentUser = payload;
  } catch (err) {
    
  };

  // move on to the next middleware regardless of the decoding success/failure
  next();
};