import passport from 'passport';
import httpStatus from 'http-status';

import { NextFunction, Request, Response } from 'express';

import ApiError from '../utils/ApiError';
import roles from '../config/roles';
import { IUserDocument } from '../models/user.model';

const verifyCallback = (
  req: Request,
  resolve: any,
  reject: any,
  requiredRights: any[],
) => async (err: Error, user: IUserDocument, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roles.roleRights.get(user.roles);
    const hasRequiredRights = requiredRights.every((requiredRight: any[]) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

export const auth = (...requiredRights: any[]) => async (req: Request, res: Response, next: NextFunction) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
  .then(() => next())
  .catch((err) => next(err));
