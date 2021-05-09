'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const articleKeys = [`title`, `announce`, `fullText`, `category`, `comments`];

const validateArticleAttr = (req, res, next) => {
  const newArticleKeys = req.body && Object.keys(req.body);
  if (!newArticleKeys || !newArticleKeys.some((key) => articleKeys.includes(key))) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

const validateNewArticle = (req, res, next) => {
  const newArticleKeys = req.body && Object.keys(req.body);
  if (!newArticleKeys || !newArticleKeys.every((key) => articleKeys.includes(key))) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

module.exports = {
  validateArticleAttr,
  validateNewArticle
};
