'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {mostPopularArticles} = require(`../../service/utils`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

const ARTICLES_PER_PAGE = 4;
const MAX_COMMENTED_ARTICLES = 3;

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categoriesToArticles
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);
  // TODO написать запросы для наиболе коментируемых и последних откоменченых статей
  const sortedArticles = mostPopularArticles(articles);
  const lastCommentedArticles = sortedArticles.slice(0, MAX_COMMENTED_ARTICLES);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const {user} = req.session;

  res.render(`main`, {articles, categoriesToArticles, lastCommentedArticles, sortedArticles, page, totalPages, user});
});
mainRouter.get(`/search`, async (req, res) => {

  try {
    const {search} = req.query;
    const results = await api.search(search) || [];
    res.render(`search-${results.length ? `results` : `nothing`}`, {
      results,
      search
    });
  } catch (error) {
    res.render(`search-empty`);
  }
});
mainRouter.get(`/comments`, async (req, res) => {
  const proposals = await api.getArticles({comments: true});
  const slicedProposals = proposals.slice(0, 3);
  res.render(`comments`, {proposals: slicedProposals});
});
mainRouter.get(`/register`, (req, res) => {
  const {error} = req.query;
  res.render(`register`, {error});
});
mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file && file.filename,
    name: `${body[`name`]} ${body[`surname`]}`,
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    res.redirect(`/register?error=${encodeURIComponent(error.response.data)}`);
  }
});
mainRouter.get(`/login`, (req, res) => {
  const {error} = req.query;

  res.render(`login`, {error});
});
mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});
mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    res.redirect(`/`);
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = mainRouter;
