"use strict";

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Alias = require(`./alias`);
const {Model} = require(`sequelize`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USER, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USER, foreignKey: `userId`});

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
