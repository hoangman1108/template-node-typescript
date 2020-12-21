import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import { Schema } from 'mongoose';
import config from '../config/config';
import { IToken, TokenCollection } from '../models/token.model';
import { tokenTypes } from '../config/tokens';
import ApiError from '../utils/ApiError';
import UserService from './user.service';
import { IUserDocument } from '../models/user.model';
import { IGenerateAuthTokens, IJwtPayload } from '../interfaces/auth.interface';

export default class TokenService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  generateToken = (userId: string, expires: moment.Moment, type: string, secret = config.jwt.secret): string => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };

  saveToken = async (token: string, userId: any, expires: moment.Moment, type: any, blacklisted = false) => {
    const tokenDoc = await TokenCollection.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  };

  verifyToken = async (token: string, type: any): Promise<IToken> => {
    const payload: any | IJwtPayload = jwt.verify(token, config.jwt.secret);
    const tokenDoc: IToken | null = await TokenCollection.findOne({
      token, type, user: <Schema.Types.ObjectId>payload.sub, blacklisted: false,
    });
    if (!tokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
    }
    return tokenDoc;
  };

  generateAuthTokens = async (user: { id: string }): Promise<IGenerateAuthTokens> => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = this.generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };

  generateResetPasswordToken = async (email: any): Promise<string> => {
    const user: IUserDocument | null = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken: string = this.generateToken(user.id || '', expires, tokenTypes.RESET_PASSWORD);
    await this.saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  };
}
