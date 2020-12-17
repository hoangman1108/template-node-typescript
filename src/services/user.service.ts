import httpStatus from 'http-status';
import { IUserDocument, UserCollection } from '../models/user.model';
import ApiError from '../utils/ApiError';

export default class UserService {
  createUser = async (userBody: IUserDocument): Promise<IUserDocument> => {
    if (await UserCollection.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user: IUserDocument | null = await UserCollection.create(userBody);
    if (!user) throw new ApiError(422, 'User cannot be created');
    return user;
  };

  queryUsers = async (filter: any, options: any) => {
    const users = await UserCollection.paginate(filter, options);
    return users;
  };

  getUserById = async (id: string): Promise<IUserDocument> => UserCollection.findById(id).then((user: IUserDocument | null) => {
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    return user;
  });

  getUserByEmail = async (email: any): Promise<IUserDocument | null> => UserCollection.findOne({ email }).then((user: IUserDocument | null) => {
    if (user) return user;
    throw new Error('User does not exist in email');
  });

  updateUserById = async (userId: any, updateBody: any) => {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await UserCollection.isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };

  deleteUserById = async (userId: any) => {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
  };
}
