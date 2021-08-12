'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const commentKey = `name`;

module.exports = (req, res, next) => {
  const hasCommentText = commentKey in req.body && req.body[commentKey].length;

  if (!hasCommentText) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
