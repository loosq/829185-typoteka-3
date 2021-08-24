'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

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

module.exports = mainRouter;
