import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validationResult is used to pull off the information
  // provided in the middleware like the custom `withMessage` data
  const errors = validationResult(req);

  // return a 400 error with the array of errors if there are any
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
