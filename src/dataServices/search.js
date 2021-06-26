'use strict';

class SearchService {
  constructor(articles) {
    this.articles = articles || [];
  }

  findAll(searchPhrase) {
    return this.articles.filter(({title}) => title.toLowerCase().includes(String(searchPhrase).toLowerCase()));
  }
}

module.exports = SearchService;
