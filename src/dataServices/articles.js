'use strict';

const {nanoid} = require(`nanoid`);
const {getCurrentDate} = require(`../service/utils`);

class ArticlesService {
  constructor(articles) {
    this.articles = articles || [];
  }

  findAll() {
    return this.articles;
  }

  findOne(articleId) {
    return this.articles.find(({id}) => articleId === id);
  }

  create(article) {
    article.id = nanoid();
    article.createdDate = getCurrentDate();
    this.articles.push(article);
    return article;
  }

  update(id, offerAttr) {
    Object.assign(this.findOne(id), offerAttr);
    return this.findOne(id);
  }
}

module.exports = ArticlesService;
