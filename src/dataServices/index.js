'use strict';

const SearchService = require(`./search`);
const CategoriesService = require(`./categories`);
const ArticlesService = require(`./articles`);
const CommentsService = require(`./comments`);
const UserService = require(`./user`);

module.exports = {
  SearchService,
  CategoriesService,
  ArticlesService,
  CommentsService,
  UserService
};
