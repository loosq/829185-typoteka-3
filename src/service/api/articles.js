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

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;

    const haveArticle = await articlesService.findOne(articleId, needComments);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    return res.status(HTTP_CODES.OK).json(haveArticle);
  });

  route.post(`/`, validateNewArticle, async (req, res) => {
    const newArticle = await articlesService.create(req.body);

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

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const haveArticle = await articlesService.findOne(articleId);

    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }
    await articlesService.drop(articleId);

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

  route.delete(`/:articleId/comments/:commentId`, async (req, res) => {
    const {articleId, commentId} = req.params;
    const article = await articlesService.findOne(articleId);

    if (!article) {
      return res.status(HTTP_CODES.BAD_REQUEST)
        .send(`Can not delete, no such id: ${articleId} in articles`);
    }

    const commentsByIdArticle = await commentsService.findAll(article.id);
    const haveComment = commentsByIdArticle.some(({id}) => id === +commentId);

    if (!haveComment) {
      return res.status(HTTP_CODES.BAD_REQUEST)
        .send(`Can not delete, no such comment with id: ${commentId} in article id: ${articleId}`);
    }
    await commentsService.destroy(article.id, commentId);

    return res.status(HTTP_CODES.OK).send(`Comment with id: ${commentId} was successfully deleted from article id: ${articleId}`);
  });

  route.post(`/:articleId/comments`, commentsValidator, async (req, res) => {
    const {articleId} = req.params;
    const newComment = req.body;
    const haveArticle = await articlesService.findOne(articleId);
    if (!haveArticle) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(`No article with such id: ${articleId}`);
    }

    const addedComment = await commentsService.create(haveArticle, newComment);

    return res.status(HTTP_CODES.CREATED).json(addedComment);
  });
};
