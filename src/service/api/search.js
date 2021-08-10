'use strict';

const Router = require(`express`);
const route = new Router();
const {searchValidator} = require(`../../dataValidators`);
const {HTTP_CODES} = require(`../constants`);

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, searchValidator, (req, res) => {
    const {search} = req.query;
    const response = service.findAll(search);

    return res.status(HTTP_CODES.OK).json(response);
  });
};
