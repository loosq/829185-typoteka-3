'use strict';

const {validArticles} = require(`./test_mocks`);
const request = require(`supertest`);
const initApi = require(`../api`);
const {HTTP_CODES} = require(`../constants`);
const express = require(`express`);
const app = express();

const routes = initApi(validArticles);
const apiSearch = `/api/search?q=`;
app.use(`/api`, routes);

describe(`Search API end-points`, () => {
  test(`When get /api/search valid search request, res code should be 200`, async () => {
    const res = await request(app).get(`${apiSearch}20`);
    expect(res.statusCode).toBe(HTTP_CODES.OK);
  });

  test(`When get /api/search empty request, res code should be 400`, async () => {
    const res = await request(app).get(`${apiSearch}`);
    expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test(`When get /api/search with valid request, res body should be an array`, async () => {
    const res = await request(app).get(`${apiSearch}20`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
