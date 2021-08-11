'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const SearchService = require(`../../dataServices/search`);
const {mockCategories, validArticles} = require(`./test_mocks`);
const {HTTP_CODES} = require(`../constants`);


const createAPI = async () => {
  const categories = mockCategories.map(({name}) => name);
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());

  await initDB(mockDB, {categories, articles: validArticles});
  search(app, new SearchService(mockDB));

  return app;
};

describe(`Search API end-points`, () => {

  describe(`When get valid query`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/search`)
        .query({
          search: `ip`
        });
    });

    it(`Status code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODES.OK));
    it(`1 article should be found`, () => expect(response.body.length).toBe(1));
    it(`Article has correct title`, () => expect(response.body[0].title).toBe(`Нашёл его по ip`));
  });

  describe(`When get invalid query `, () => {
    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/search`)
        .query({
          search: `Текст который никогда не найдётся`
        });
    });

    it(`Response body should be []`, () => expect(response.body.length).toBe(0));

    it(`and query is not pass, res status should be 404`, async () => {
      response = await request(app).get(`/search`);

      expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  });
});
