'use strict';

const Router = require(`express`);
const route = new Router();
const {
  validateArticleAttr,
  validateNewArticle,
  commentsValidator
} = require(`../../dataValidators`);
const {HTTP_CODES} = require(`../../service/constants`);

module.exports = (app, articlesService, commentsService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articlesService.findAll(true);

    return res.status(HTTP_CODES.OK).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const haveArticle = articlesService.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    return res.status(HTTP_CODES.OK).json(haveArticle);
  });

  route.post(`/`, validateNewArticle, (req, res) => {
    const newArticle = articlesService.create(req.body);
    return res.status(HTTP_CODES.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, validateArticleAttr, (req, res) => {

    const {articleId} = req.params;
    const haveArticle = articlesService.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const updatedArticle = articlesService.update(articleId, req.body);
    return res.status(HTTP_CODES.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const haveArticle = articlesService.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    articlesService.delete(articleId);
    return res.status(HTTP_CODES.OK).send(`Article with id: ${articleId}, was successfully deleted`);
  });

  route.get(`/:articleId/comments`, (req, res) => {
    const {articleId} = req.params;
    const haveArticle = articlesService.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const comments = commentsService.findAll(haveArticle);
    return res.status(HTTP_CODES.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, (req, res) => {
    const {articleId, commentId} = req.params;
    const haveArticle = articlesService.findOne(articleId);
    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const haveComment = commentsService.findOne(haveArticle, commentId);

    if (!haveComment) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No comment with such id: ${commentId} in article id: ${articleId}`);
    }

    commentsService.delete(haveArticle, commentId);

    return res.status(HTTP_CODES.OK).send(`Comment with id: ${commentId}, was successfully deleted from article id: ${articleId}`);
  });

  route.post(`/:articleId/comments`, commentsValidator, (req, res) => {
    const {articleId} = req.params;
    const newComment = req.body;
    const haveArticle = articlesService.findOne(articleId);
    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const addedComment = commentsService.create(haveArticle, newComment);

    return res.status(HTTP_CODES.CREATED).json(addedComment);
  });
};
