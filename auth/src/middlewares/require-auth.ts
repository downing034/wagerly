import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from '../errors/not-authorized-error';

// assumes a jwt is present, decoded, and set on req.currentUser
export const requireAuth = (
  res: Response,
  req: Request,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

// continue on if logged in
  next();
};