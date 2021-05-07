'use strict';
const {nanoid} = require(`nanoid`);

class CommentsService {
  findAll(article) {
    return article.comments || [];
  }

  findOne(article, commentId) {
    return article.comments.find(({id}) => id === commentId);
  }

  delete(article, commentId) {
    article.comments = article.comments.filter(({id}) => id !== commentId);
  }

  create(haveArticle, newComment) {
    newComment.id = nanoid();
    haveArticle.comments.push(newComment);
    return haveArticle;
  }
}

module.exports = CommentsService;
