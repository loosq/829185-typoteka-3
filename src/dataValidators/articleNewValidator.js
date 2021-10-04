'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const articleBaseSchema = require(`./articleBaseSchema`);
const MIN_CATEGORIES_COUNT = 1;
const errorCommentMessage = (text) => `Поле ${text} обязательно для заполнения`;

const extendedArticleSchema = articleBaseSchema.keys({
  user: Joi.required().messages({
    'any.required': errorCommentMessage(`user`)
  }),
  title: Joi.required().messages({
    'any.required': errorCommentMessage(`title`)
  }),
  fullText: Joi.required().messages({
    'any.required': errorCommentMessage(`fullText`)
  }),
  announce: Joi.required().messages({
    'any.required': errorCommentMessage(`announce`)
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(MIN_CATEGORIES_COUNT).required().messages({
    'number.base': `Содержимое массива categories не соответствует ожидаемому типу данных`,
    'any.required': `Хотя бы 1 категория должна быть выбрана`,
    'array.base': `"categories" должен быть массивом`
  }),
});

module.exports = (req, res, next) => {
  const {error} = extendedArticleSchema.validate(req.body);

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
