'use strict';

const Router = require(`express`);
const route = new Router();
const {searchValidator} = require(`../../dataValidators`);

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, searchValidator, (req, res) => {
    const articles = service.findAll(req.query.q);
    return res.json(articles);
  });
};
