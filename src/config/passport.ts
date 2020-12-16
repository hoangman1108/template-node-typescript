import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './tokens';
// import { User } from '../models';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: any, done: any) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    // const user = await User.findById(payload.sub);
    const user = {
      name: 'hoang man',
    }
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
