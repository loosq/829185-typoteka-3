'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const articleKeys = [`title`, `announce`, `fullText`, `category`, `comments`];

const validateArticleAttr = (req, res, next) => {
  const isExistArticleKeys = req.body && Object.keys(req.body);
  const isExistNewArticles = isExistArticleKeys.some((key) => articleKeys.includes(key));

  if (!isExistArticleKeys || !isExistNewArticles) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

const validateNewArticle = (req, res, next) => {
  const isExistArticleKeys = req.body && Object.keys(req.body);
  const isExistNewArticles = isExistArticleKeys.every((key) => articleKeys.includes(key));

  if (!isExistArticleKeys || !isExistNewArticles) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

module.exports = {
  validateArticleAttr,
  validateNewArticle
};
