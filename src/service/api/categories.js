'use strict';

const Router = require(`express`);
const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);
  route.get(`/`, (req, res) => {
    const articles = service.findAll();
    return res.json(articles);
  });
};
