'use strict';

const FILENAME = `mocks.json`;
const {Router} = require(`express`);
const {getMocks} = require(`../utils`);
const search = require(`../api/search`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const app = new Router();
const {
  SearchService,
  CategoriesService,
  ArticlesService
} = require(`../../dataServices`);

(async () => {
  const mocks = await getMocks(FILENAME);

  articles(app, new ArticlesService(mocks));
  categories(app, new CategoriesService(mocks));
  search(app, new SearchService(mocks));
})();

module.exports = app;
