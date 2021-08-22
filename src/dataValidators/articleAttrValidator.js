'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);
const minArticleId = 1;
const minCommentId = 1;

const schema = Joi.object({
  articleId: Joi.number().integer().min(minArticleId),
  commentId: Joi.number().integer().min(minCommentId)
});

module.exports = (req, res, next) => {
  const error = schema.validate(req.body);

  if (!error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
