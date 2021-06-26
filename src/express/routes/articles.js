const {Router} = require(`express`);
const articlesRouter = new Router();
const { countCategoriesToArticles, mostPopularArticles } = require('../../service/utils');
const api = require(`../api`).getAPI();

articlesRouter.get(`/`, async (req, res) => {
  const allArticles = await api.getArticles();
  const sortedArticles = mostPopularArticles(allArticles);
  const categoriesToArticles = countCategoriesToArticles(allArticles);
  // TODO добавить в коммент дату и сортировать по ней
  const lastCommentedArticles = sortedArticles.slice(0,3);

  res.render(`main`, { allArticles, categoriesToArticles, sortedArticles, lastCommentedArticles })
});
articlesRouter.get(`/category/:id`, (req, res) => res.send(`/category/:id ${req.params.id}`));
articlesRouter.get(`/add`, (req, res) => res.render(`admin-categories.pug`));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id);

  res.render(`admin-add-new-post`, { article })
});
articlesRouter.get(`/:id`, (req, res) => res.send(`/articles/:id ${req.params.id}`));

module.exports = articlesRouter;
