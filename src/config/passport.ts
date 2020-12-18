import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/auth.interface';
import { UserCollection } from '../models/user.model';
import config from './config';
import { tokenTypes } from './tokens';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: IJwtPayload, done: Function) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await UserCollection.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
