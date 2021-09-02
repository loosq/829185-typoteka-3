'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const articleBaseSchema = require(`./articleBaseSchema`);
const MIN_CATEGORIES_COUNT = 1;

const extendedArticleSchema = articleBaseSchema.keys({
  user: Joi.required(),
  title: Joi.required(),
  fullText: Joi.required(),
  announce: Joi.required(),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(MIN_CATEGORIES_COUNT).required()
});

module.exports = (req, res, next) => {
  const {error} = extendedArticleSchema.validate(req.body);

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
