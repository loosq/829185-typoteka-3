'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const newCommentKeys = Object.keys(req.body);

  if (!commentKeys.every((key) => newCommentKeys.includes(key))) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};