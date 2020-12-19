import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IGenerateAuthTokens } from '../interfaces/auth.interface';
import AuthService from '../services/auth.service';
import EmailService from '../services/email.service';
import TokenService from '../services/token.service';
import UserService from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';

export default class AuthController {
  private userService: UserService;

  private tokenService: TokenService;

  private authService: AuthService;

  private emailService: EmailService;
  
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
    this.emailService = new EmailService();
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    const tokens = await this.tokenService.generateAuthTokens({ id: user.id || '' });
    res.status(httpStatus.CREATED).send({ user, tokens });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.loginUserWithEmailAndPassword(email, password);
    const tokens: IGenerateAuthTokens = await this.tokenService.generateAuthTokens({ id: user.id || '' });
    res.send({ user, tokens });
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await this.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
    await this.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    console.log(req.query.token, 'req.query.token');
    await this.authService.resetPassword(req.query.token?.toString() || '', req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });
}
