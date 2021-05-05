'use strict';

const searchValidator = require(`./searchValidator`);
const commentsValidator = require(`./commentsValidator`);
const {validateArticleAttr, validateNewArticle} = require(`./articlesValidator`);

module.exports = {
  searchValidator,
  validateArticleAttr,
  validateNewArticle,
  commentsValidator
};
