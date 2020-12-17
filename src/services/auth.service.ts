import httpStatus from 'http-status';
import { tokenTypes } from '../config/tokens';
import { IToken, TokenCollection } from '../models/token.model';
import ApiError from '../utils/ApiError';
import TokenService from './token.service';
import UserService from './user.service';

export default class AuthService {
  tokenService: TokenService;

  userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
  }

  loginUserWithEmailAndPassword = async (email: string, password: string) => {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  };

  logout = async (refreshToken: string) => {
    const refreshTokenDoc = await TokenCollection.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.remove();
  };

  refreshAuth = async (refreshToken: string) => {
    try {
      const refreshTokenDoc: IToken = await this.tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await this.userService.getUserById(refreshTokenDoc.user.toString());
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return this.tokenService.generateAuthTokens({ id: user.id || '' });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  };

  resetPassword = async (resetPasswordToken: string, newPassword: string) => {
    try {
      const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = await this.userService.getUserById(resetPasswordTokenDoc.user.toString());
      if (!user) {
        throw new Error();
      }
      await TokenCollection.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
      await this.userService.updateUserById(user.id, { password: newPassword });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  };
}
