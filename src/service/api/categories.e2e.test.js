'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./categories`);
const DataService = require(`../../dataServices/categories`);
const {mockCategories, validArticles} = require(`./test_mocks`);
const {HTTP_CODES} = require(`../constants`);


const createAPI = async () => {
  const categories = mockCategories.map(({name}) => name);
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());

  await initDB(mockDB, {categories, articles: validArticles});
  category(app, new DataService(mockDB));

  return app;
};

describe(`API returns category list`, () => {
  let response; let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/categories`);
  });

  it(`Status code 200`, () => {
    expect(response.statusCode).toBe(HTTP_CODES.OK);
  });

  it(`Returns list of 15 categories`, () => {
    expect(response.body.length).toBe(15);
  });

  it(`Category names are mocked categories`,
      () => expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining(mockCategories.map(({name}) => name))
      )
  );
});
