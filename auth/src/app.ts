import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// stuff is being proxied by ingress-nginx
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // disable encryptioin because jwt is already encrypted
    signed: false,
    // force https connectionby user
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// keep errorHandler at the end
app.use(errorHandler);

export { app };