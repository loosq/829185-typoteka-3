'use strict';

const {HTTP_CODES} = require(`../service/constants`);
const commentKey = `text`;

module.exports = (req, res, next) => {

  if (!(commentKey in req.body) || !req.body[commentKey].length) {
    res.status(HTTP_CODES.BAD_REQUEST).send(`Bad request`);
  }

  next();
};
