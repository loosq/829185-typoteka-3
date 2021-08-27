'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const MIN_ARTICLE_ID = 1;
const MIN_COMMENT_ID = 1;
const articleBaseSchema = require(`./articleBaseSchema`);

const schemaArticle = Joi.object({
  articleId: Joi.number().integer().min(MIN_ARTICLE_ID),
  commentId: Joi.number().integer().min(MIN_COMMENT_ID)
});

module.exports = (req, res, next) => {
  const validateArticle = schemaArticle.validate(req.params);
  const validateArticleAttr = articleBaseSchema.validate(req.body);
  const error = {...validateArticle.error, ...validateArticleAttr.error};

  if (error.details) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
