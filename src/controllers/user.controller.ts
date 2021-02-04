import { Request, Response } from 'express';
import httpStatus from 'http-status';
import UserService from '../services/user.service';
import ApiError from '../utils/ApiError';
import { catchAsync } from 'catch-async-express';
import { pick } from '../utils/pick';

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  });

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await this.userService.queryUsers(filter, options);
    res.send(result);
  });

  getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  });

  updateUser = catchAsync(async (req:Request, res: Response) => {
    const user = await this.userService.updateUserById(req.params.userId, req.body);
    res.send(user);
  });

  deleteUser = catchAsync(async (req:Request, res: Response) => {
    await this.userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  });
}
