'use strict';

const Router = require(`express`);
const route = new Router();
const {HTTP_CODES} = require(`../../service/constants`);

module.exports = (app, service) => {
  app.use(`/categories`, route);
  route.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);
    res.status(HTTP_CODES.OK).json(categories);
  });
};
