"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, posts}) => {

  const {Category, Post} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories.map((item) => ({name: item})));
  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    ...acc,
    [item.name]: item.id,
  }), {});

  const postPromises = posts.map(async (post) => {
    const offerModel = await Post.create(post, {include: [Alias.COMMENTS]});
    await offerModel.addCategories(post.categories.map((name) => categoryIdByName[name]));
  });

  await Promise.all(postPromises);
};
