import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

// import session from './middlewares/session';
import { errorConverter, errorHandler } from './middlewares/error';
import router from './routers/index';
import ApiError from './utils/ApiError';
import config from './config/config';
import { jwtStrategy } from './config/passport';
import morgan from './config/morgan';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// enable cors
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(cookieParser('secret'));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// connect-redis
// app.use(session);

router.Start();
app.use('/api', router.getRouter());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
