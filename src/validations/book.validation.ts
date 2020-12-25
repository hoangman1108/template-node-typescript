import Joi from 'joi';

const createBook = {
  body: Joi.object().keys({
    libId: Joi.string().required(),
    author: Joi.string().required(),
    status: Joi.string().valid('DONE', 'READING'),
    name: Joi.string().required(),
  }),
};

const getBooks = {
  body: Joi.object().keys({
    name: Joi.string(),
    libId: Joi.string(),
    sortBy: Joi.string(),
    author: Joi.string(),
    status: Joi.string().valid('DONE', 'READING'),

    populate: Joi.string(),
    typeSort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteBook = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export default {
  createBook,
  getBooks,
  deleteBook,
};
