'use strict';

const {
  validArticles,
  validArticle,
  validArticleAttr,
  invalidArticle,
  invalidArticleAttr,
  validComment,
  invalidComment,
  emptyComment,
  mockCategories
} = require(`./test_mocks`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const ArticleService = require(`../../dataServices/articles`);
const CommentsService = require(`../../dataServices/comments`);
const {HTTP_CODES} = require(`../constants`);

const createAPI = async () => {
  const categories = mockCategories.map(({name}) => name);
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());

  await initDB(mockDB, {categories, articles: validArticles});
  articles(app, new ArticleService(mockDB), new CommentsService(mockDB));

  return app;
};

describe(`Article API end-points`, () => {

  describe(`When post /articles`, () => {
    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/articles`)
        .send(validArticle);
    });

    it(`With valid article, response code should be 201`, () => expect(response.statusCode).toBe(HTTP_CODES.CREATED));
    it(`With valid article, response body.title equals to mock`, () => expect(response.body.title).toEqual(validArticle.title));
    it(`With invalid article, response code should be 400`, async () => {
      response = await request(app).post(`/articles`).send(invalidArticle);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  describe(`When get /articles`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/articles`);
    });

    it(`Response code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODES.OK));
    it(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(4));
    it(`First article id equals 1`, () => expect(response.body[0].id).toBe(1));
  });

  describe(`When get /articles/:articleId`, () => {
    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles/1`);
    });

    it(`With valid article id, response code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODES.OK));
    it(`With valid article id, response article title should be equal to mocks`, () => expect(response.body.title).toEqual(validArticles[0].title));
    it(`With invalid article id, response code should be 400`, async () => {
      response = await request(app).get(`/articles/NOT_EXISTING_ID`);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  describe(`When put /article/:id to update existing article with valid attr`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .put(`/articles/1`)
        .send(validArticleAttr);
    });

    it(`Response code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODES.OK));
    it(`Response body should be truthy`, () => expect(response.body).toBeTruthy());
  });

  describe(`When put /articles/:id `, () => {
    let response; let app;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/articles/not_existing_id`)
        .send(invalidArticleAttr);
    });

    it(`to update not existing article, response code should be 400`, async () => {
      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it(`to update existing article with invalid attr, response code should be 400`, async () => {
      response = await request(app).put(`/articles/1`).send(invalidArticleAttr);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  describe(`When delete /articles/:id`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app).delete(`/articles/1`);
    });

    it(`Response code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODES.OK));

    it(`Second try to delete same id should return 404`, async () => {
      response = await request(app).delete(`/articles/1`);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  describe(`When delete /articles/:articleId/comments/:commentId`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app).delete(`/articles/1/comments/1`);
    });

    it(`Response code should be 200`, async () => expect(response.statusCode).toBe(HTTP_CODES.OK));

    it(`Not existing articleId, response code should be 400`, async () => {
      response = await request(app).delete(`/articles/NOT_EXISTING_ARTICLE/comments/1`);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it(`Not existing commentId, response code should be 400`, async () => {
      response = await request(app).delete(`/articles/1/comments/NOT_EXISTING_COMMENT_ID`);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });

  describe(`When post /articles/:articleId/comments`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app).post(`/articles/1/comments`).send(validComment);
    });

    it(`With valid comment, response code should be 201`, () => expect(response.statusCode).toBe(HTTP_CODES.CREATED));

    it(`With invalid comment, wrong key, response code should be 400`, async () => {
      response = await request(app).post(`/articles/1/comments`).send(invalidComment);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it(`With invalid comment, empty length, response code should be 400`, async () => {
      response = await request(app).post(`/articles/1/comments`).send(emptyComment);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });
});
