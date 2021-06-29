'use strict';

class CategoriesService {
  constructor(articles) {
    this.articles = articles || [];
  }

  findAll() {
    const categories = new Set();

    this.articles.map((article) => Array.isArray(article.categories) && article.categories.forEach((category) => category && categories.add(category)));

    return Array.from(categories);
  }
}

module.exports = CategoriesService;
