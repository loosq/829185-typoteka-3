'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const Joi = require(`joi`);
const schema = Joi.string().required().messages({
  'any.required': `Обязатеьное поле`,
  'string.base': `Ожидается 'text'`,
});

module.exports = (req, res, next) => {
  const {error} = schema.validate(req.query.search);

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
