"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Post extends Model {}

const define = (sequelize) => Post.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: DataTypes.STRING,
  announce: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  fullText: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
}, {
  sequelize,
  modelName: `Post`,
  tableName: `posts`
});

module.exports = define;
