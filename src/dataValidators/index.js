'use strict';

const searchValidator = require(`./searchValidator`);
const {validateArticleAttr, validateNewArticle} = require(`./articlesValidator`);

module.exports = {
  searchValidator,
  validateArticleAttr,
  validateNewArticle
};
