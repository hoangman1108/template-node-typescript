import Joi from 'joi';

const createLib = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

const getLibs = {
  body: Joi.object().keys({
    name: Joi.string(),
    amount: Joi.number(),
    sortBy: Joi.string(),
    typeSort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export default {
  createLib,
  getLibs,
};
