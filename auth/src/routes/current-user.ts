import express from "express";
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

/*
  React app needs to figure out if user is signed into our app
  The react app cannot directly look at the cookie and try to
  inspect whether the jwt is there and valid due to how our cookies
  are setup. Instead, we have a request endpoint for currentuser
*/

// route, middleware, code to execute
router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };