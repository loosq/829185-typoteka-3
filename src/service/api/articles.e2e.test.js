'use strict';

const {
  validArticles,
  validArticle,
  validArticleAttr,
  invalidArticle,
  invalidArticleAttr,
  validComment,
  invalidComment,
  emptyComment
} = require(`./test_mocks`);
const request = require(`supertest`);
const initApi = require(`../api`);
const {HTTP_CODES} = require(`../constants`);
const {app} = require(`../cli/server`);

const routes = initApi(validArticles);
const apiArticles = `/api/articles`;
app.use(`/api`, routes);

describe(`Articles API end-points`, () => {
  test(`When get /api/articles valid request, res code should be 200`, async () => {
    const res = await request(app).get(`${apiArticles}`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When get /api/articles valid request, res body should be an array`, async () => {
    const res = await request(app).get(`${apiArticles}`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`When post /api/articles valid article, res code should be 201`, async () => {
    const res = await request(app).post(`${apiArticles}`).send(validArticle);
    expect(res.statusCode).toBe(HTTP_CODES.CREATED);
  });

  test(`When post /api/articles invalid article, res code should be 400`, async () => {
    const res = await request(app).post(`${apiArticles}`).send(invalidArticle);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When put /api/articles/:id valid request, res code should be 200`, async () => {
    const res = await request(app).put(`${apiArticles}/${validArticles[0].id}`).send(validArticleAttr);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When put /api/articles/:id invalid request, res code should be 400`, async () => {
    const res = await request(app).put(`${apiArticles}/${validArticles[0].id}`).send(invalidArticleAttr);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When delete /api/articles/:id valid request, res code should be 200`, async () => {
    const res = await request(app).delete(`${apiArticles}/${validArticles[2].id}`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When delete /api/articles/:id valid request and request same id after, res code should be 400`, async () => {
    await request(app).delete(`${apiArticles}/${validArticles[1].id}`).then(async () => {
      const res = await request(app).delete(`${apiArticles}/${validArticles[1].id}`);
      expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  test(`When delete /api/articles/:id invalid id, res code should be 400`, async () => {
    const res = await request(app).delete(`${apiArticles}/some_invalid_id`);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When get /api/articles/:id/comments, res code should be 200`, async () => {
    const res = await request(app).get(`${apiArticles}/${validArticles[0].id}/comments`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When get /api/articles/:id/comments, res body should be an array`, async () => {
    const res = await request(app).get(`${apiArticles}/${validArticles[0].id}/comments`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`When delete /api/articles/:id/comments/:commentId valid id, res body should be 200`, async () => {
    const res = await request(app).delete(`${apiArticles}/${validArticles[3].id}/comments/${validArticles[3].comments[0].id}`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When delete /api/articles/:id/comments/:commentId invalid article id, res body should be 400`, async () => {
    const res = await request(app).delete(`${apiArticles}/some_invalid_article_id/comments/${validArticles[3].comments[0].id}`);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When post /api/articles/:id/comments/:commentId valid comment, res code should be 200`, async () => {
    const res = await request(app).post(`${apiArticles}/${validArticles[0].id}/comments`).send(validComment);
    expect(res.statusCode).toBe(HTTP_CODES.CREATED);
  });

  test(`When post /api/articles/:id/comments/:commentId invalid comment, res code should be 400`, async () => {
    const res = await request(app).post(`${apiArticles}/${validArticles[0].id}/comments`).send(invalidComment);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When post /api/articles/:id/comments/:commentId empty comment, res code should be 400`, async () => {
    const res = await request(app).post(`${apiArticles}/${validArticles[0].id}/comments`).send(emptyComment);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });
});
