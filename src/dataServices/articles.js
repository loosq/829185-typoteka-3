'use strict';

const Alias = require(`../service/models/alias`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push([Alias.COMMENTS, {
        model: this._User,
        as: Alias.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }]);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }

  findOne(id, needComments) {
    let options = [Alias.CATEGORIES, {
      model: this._User,
      as: Alias.USER,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];

    if (needComments) {
      options.push(Alias.COMMENTS);
    }

    return this._Article.findByPk(id, {include: options});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findPage({limit, offset, comments}) {
    const include = [Alias.CATEGORIES];
    if (comments) {
      include.push(Alias.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = ArticlesService;
