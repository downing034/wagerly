import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    // first validate the data
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  // then validate the request
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

      // if the user doesn't exist, throw an error
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    };

    // compare password provided with password from database
    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    };

     // Generate JWT
     const userJwt = jwt.sign(
      // data to pass in
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      // jwt secret key
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
