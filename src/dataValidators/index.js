'use strict';

const searchValidator = require(`./searchValidator`);
const commentsValidator = require(`./commentsValidator`);
const articleNewAttrValidator = require(`./articleNewAttrValidator`);
const articleNewValidator = require(`./articleNewValidator`);
const userValidator = require(`./userValidator`);

module.exports = {
  searchValidator,
  articleNewValidator,
  articleNewAttrValidator,
  commentsValidator,
  userValidator
};
