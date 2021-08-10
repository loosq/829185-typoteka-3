"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, articles}) => {

  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories.map((item) => ({name: item})));
  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    ...acc,
    [item.name]: item.id,
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(article.categories.map((name) => categoryIdByName[name]));
  });

  await Promise.all(articlePromises);
};
