'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {mostPopularArticles, lastComments} = require(`../../service/utils`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const ARTICLES_PER_PAGE = 4;
const MAX_COMMENTED_ARTICLES = 3;
const MOST_POPULAR_ARTICLES = 4;
const moment = require(`moment`);

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    allArticles,
    categoriesToArticles
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  // TODO запросы для самых популярных и наиболее комментируемых статей перенести на вебсокеты
  const popularArticles = mostPopularArticles(allArticles);
  const lastCommentedArticles = lastComments(allArticles);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const {user} = req.session;

  res.render(`main`, {
    articles,
    categoriesToArticles,
    lastCommentedArticles: lastCommentedArticles.slice(0, MAX_COMMENTED_ARTICLES),
    popularArticles: popularArticles.slice(0, MOST_POPULAR_ARTICLES),
    page,
    totalPages,
    user,
    moment
  });
});
mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search) || [];
    res.render(`search/search-${results.length ? `results` : `nothing`}`, {
      results,
      search,
      user
    });
  } catch (error) {
    res.render(`search/search-empty`, {user});
  }
});
mainRouter.get(`/comments`, async (req, res) => {
  const proposals = await api.getArticles({comments: true});
  const slicedProposals = proposals.slice(0, 3);
  res.render(`comments`, {proposals: slicedProposals});
});
mainRouter.get(`/register`, (req, res) => {
  const {error} = req.query;
  res.render(`auth/register`, {error});
});
mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: (file && file.filename) || null,
    name: `${body[`name`]} ${body[`surname`]}`,
    email: body[`email`],
    isBlogOwner: false,
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
  const {user} = req.session;

  if (user) {
    res.redirect(`/`);
  }

  res.render(`auth/login`, {error});
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
