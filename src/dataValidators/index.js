'use strict';

const searchValidator = require(`./searchValidator`);
const commentsValidator = require(`./commentsValidator`);
const articleNewAttrValidator = require(`./articleNewAttrValidator`);
const articleNewValidator = require(`./articleNewValidator`);

module.exports = {
  searchValidator,
  articleNewValidator,
  articleNewAttrValidator,
  commentsValidator
};
