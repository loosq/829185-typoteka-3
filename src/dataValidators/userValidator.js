'use strict';

const Joi = require(`joi`);
const {HTTP_CODES} = require(`../service/constants`);

const errorEmptyKeyMessage = (text) => `Поле ${text} обязательно для заполнения`;
const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`,
  SECOND_BLOG_OWNER: `Владелец блога уже сущесвует`,
  NO_AVATAR: `Загрузите аватар`
};

const schema = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'any.required': errorEmptyKeyMessage(`name`),
    'string.pattern.base': ErrorRegisterMessage.NAME
  }),
  email: Joi.string().email().required().messages({
    'any.required': errorEmptyKeyMessage(`email`),
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': errorEmptyKeyMessage(`password`),
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.required': errorEmptyKeyMessage(`passwordRepeated`),
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  isBlogOwner: Joi.bool().required(),
  avatar: Joi.string().optional().allow(null).messages({
    'string.empty': ErrorRegisterMessage.AVATAR
  })
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser);

  if (newUser.isBlogOwner) {
    const haveBlogOwner = await service.findBlogOwner();

    if (haveBlogOwner && haveBlogOwner.id) {
      res.status(HTTP_CODES.BAD_REQUEST)
        .send(ErrorRegisterMessage.SECOND_BLOG_OWNER);
    }
  }

  if (error) {
    return res.status(HTTP_CODES.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HTTP_CODES.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
