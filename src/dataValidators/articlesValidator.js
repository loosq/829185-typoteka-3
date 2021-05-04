'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const articleKeys = [`title`, `announce`, `fullText`, `category`, `comments`];

const validateArticleAttr = (req, res, next) => {
  const newArticleKeys = Object.keys(req.body);
  if (!newArticleKeys.some((key) => articleKeys.includes(key))) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
    return;
  }

  next();
};

const validateNewArticle = (req, res, next) => {
  const newArticleKeys = Object.keys(req.body);
  if (!newArticleKeys.every((key) => articleKeys.includes(key))) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
    return;
  }

  next();
};

module.exports = {
  validateArticleAttr,
  validateNewArticle
};
