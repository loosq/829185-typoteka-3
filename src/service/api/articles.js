'use strict';

const Router = require(`express`);
const route = new Router();
const {
  validateArticleAttr,
  validateNewArticle
} = require(`../../dataValidators`);
const {HTTP_CODES} = require(`../../service/constants`);

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = service.findAll();
    return res.status(HTTP_CODES.OK).json(articles);
  });

  route.post(`/`, validateNewArticle, (req, res) => {
    const newArticle = service.create(req.body);
    return res.status(HTTP_CODES.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, validateArticleAttr, (req, res) => {
    const {articleId} = req.params;
    const haveArticle = service.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const newArticle = service.update(articleId, req.body);
    return res.status(HTTP_CODES.CREATED).json(newArticle);
  });
};
