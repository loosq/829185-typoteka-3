'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async destroy(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentsService;
