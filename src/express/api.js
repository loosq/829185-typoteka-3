'use strict';
const {DEFAULT_SERVICE_PORT} = require(`../../src/service/constants`);
const axios = require(`axios`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || DEFAULT_SERVICE_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments} = {offset: 0, limit: 0, comments: false}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle(id, needComments = false) {
    return this._load(`/articles/${id}`, {params: {needComments}});
  }

  search(search) {
    return this._load(`/search`, {params: {search}});
  }

  async getCategories(count) {

    return this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
