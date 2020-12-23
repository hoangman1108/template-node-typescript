import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import config from '../config/config';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
export default session({
  name: 'session_name',
  secret: config.session.secretKey || 'secret_session',
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
  resave: false,
});
