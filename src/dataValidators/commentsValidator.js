'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const Joi = require(`joi`);
const MIN_COMMENT_LENGTH = 10;
const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше ${MIN_COMMENT_LENGTH} символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  name: Joi.string().min(MIN_COMMENT_LENGTH).required().messages({
    'string.empty': ErrorCommentMessage.TEXT,
    'string.min': ErrorCommentMessage.TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const {error} = schema.validate(req.body);

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
