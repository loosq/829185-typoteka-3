'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`admin-publications`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  /** TODO уточнить у наставника. В задании написано что нужно запрашивать ресурс /api/comments, это комменты ко всем публикациям?
   * судя по шаблону, хотим получить комменты авторизовавшегося пользователя, возможно доработать это после внедрения автаризации
   * */

  res.render(`admin-comments.pug`, {articles});
});

module.exports = myRouter;
