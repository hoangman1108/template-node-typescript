import Joi from 'joi';

const createEnglish = {
  body: Joi.object().keys({
    request: Joi.string().required(),
    response: Joi.string().required(),
  }),
};

const getEnglishes = {
  body: Joi.object().keys({
    request: Joi.string(),

    populate: Joi.string(),
    typeSort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const findEnglish = {
  body: Joi.object().keys({
    request: Joi.string(),
  }),
};

const deleteEnglish = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export default {
  createEnglish,
  getEnglishes,
  findEnglish,
  deleteEnglish,
};
