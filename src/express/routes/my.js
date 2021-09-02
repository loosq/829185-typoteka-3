'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res) => {
  const articles = await api.getArticles();
  const user = req.session;

  res.render(`admin-publications`, {articles, user});
});
myRouter.get(`/comments`, auth, async (req, res) => {
  const articles = await api.getArticles();
  const user = req.session;

  res.render(`admin-comments.pug`, {articles, user});
});

module.exports = myRouter;
