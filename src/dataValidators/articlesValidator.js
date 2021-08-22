'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const minCategoriesCount = 1;
const minTitleLength = 10;
const maxTitleLength = 100;
const minAnnounceLength = 50;
const maxAnnounceLength = 1000;
const minFullTextLength = 50;
const maxFullTextLength = 1000;

const schema = Joi.object({
  categories: Joi.array().items(
    Joi.number().integer().positive()
  ).min(minCategoriesCount).required(),
  title: Joi.string().min(minTitleLength).max(maxTitleLength).required(),
  announce: Joi.string().min(minAnnounceLength).max(maxAnnounceLength).required(),
  fullText: Joi.string().min(minFullTextLength).max(maxFullTextLength).required(),
  picture: Joi.string()
});

module.exports = (req, res, next) => {
  const newArticle = req.bold;
  const {error} = schema.validate(newArticle);

  if (!error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
