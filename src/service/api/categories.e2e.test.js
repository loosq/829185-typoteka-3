'use strict';

const {validArticles} = require(`./test_mocks`);
const request = require(`supertest`);
const initApi = require(`../api`);
const {HTTP_CODES} = require(`../constants`);
const express = require(`express`);
const app = express();

const routes = initApi(validArticles);
const apiCategories = `/api/categories`;
app.use(`/api`, routes);

describe(`Categories API end-points`, () => {
  test(`When get /api/categories valid request, res code should be 200`, async () => {
    const res = await request(app).get(`${apiCategories}`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When get /api/categories valid request, res body should be an array`, async () => {
    const res = await request(app).get(`${apiCategories}`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
