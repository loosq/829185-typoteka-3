'use strict';

const {Router} = require(`express`);
const search = require(`../api/search`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const app = new Router();
const {
  SearchService,
  CategoriesService,
  ArticlesService,
  CommentsService
} = require(`../../dataServices`);

const initApi = (mocks) => {
  articles(app, new ArticlesService(mocks), new CommentsService(mocks));
  categories(app, new CategoriesService(mocks));
  search(app, new SearchService(mocks));

  return app;
};

module.exports = initApi;
