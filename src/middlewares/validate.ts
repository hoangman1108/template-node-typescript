import Joi from 'joi';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { pick } from '../utils/pick';
import ApiError from '../utils/ApiError';

const validate = (schema: Object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
