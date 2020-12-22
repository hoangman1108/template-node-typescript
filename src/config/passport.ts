import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/auth.interface';
import { IUserDocument, UserCollection } from '../models/user.model';
import config from './config';
import { tokenTypes } from './tokens';

// const cookieExtractor = (req: CoolRequest) => {
//   let token = null;
//   if (req && req.cookies) token = req.session.tokens.access.token;
//   return token;
// };

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // cookieExtractor
};

const jwtVerify = async (payload: IJwtPayload, done: Function) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user: IUserDocument | null = await UserCollection.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
