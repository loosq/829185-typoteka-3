'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const Joi = require(`joi`);
const MIN_COMMENT_LENGTH = 10;

const schema = Joi.object().keys({
  name: Joi.string().min(MIN_COMMENT_LENGTH).required()
});

module.exports = (req, res, next) => {
  const {error} = schema.validate(req.body);

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
