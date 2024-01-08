import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

// code in [] is our own middleware in this case to validate posted data
router.post(
  "/api/users/signup",
  [
    // first validate the data
    body("email").isEmail().withMessage("Email must be valid"),
    // make sure there are no leading/trailing whitespaces
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  // then validate the request
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check to see if a user already exists with that email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // create the new user
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      // data to pass in
      {
        id: user.id,
        email: user.email,
      },
      // jwt secret key
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
