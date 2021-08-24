'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const minArticleId = 1;
const minCommentId = 1;
const articleBaseSchema = require(`./articleBaseSchema`);

const schemaArticle = Joi.object({
  userId: Joi.number().integer().positive().required(),
  articleId: Joi.number().integer().min(minArticleId),
  commentId: Joi.number().integer().min(minCommentId)
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
