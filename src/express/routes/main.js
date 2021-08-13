'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/login`, (req, res) => res.render(`login.pug`));
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

module.exports = mainRouter;
