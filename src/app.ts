import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import cookieParser from 'cookie-parser';

import router from './routers/index';
import ApiError from './utils/ApiError';
import { errorConverter, errorHandler } from './middlewares/error';
import { jwtStrategy } from './config/passport';
import morgan from './config/morgan';
import config from './config/config';

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

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// connect-redis
app.use(
  session({
    name: 'session_name',
    store: new RedisStore({
      host: config.redis.host,
      port: config.redis.port,
      client: redisClient,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // a day
      httpOnly: true,
      secure: false, // true to work only in https
      sameSite: 'lax', // CSFR
    },
    saveUninitialized: false,
    secret: config.session.secretKey,
  })
);

router.Start();
app.use('/', router.getRouter());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
