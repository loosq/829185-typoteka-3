'use strict';

const Joi = require(`joi`);
const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 100;
const MIN_ANNOUNCE_LENGTH = 50;
const MAX_ANNOUNCE_LENGTH = 1000;
const MIN_FULLTEXT_LENGTH = 50;
const MAX_FULLTEXT_LENGTH = 2000;

const articleBaseSchema = Joi.object({
  user: Joi.string().email(),
  categories: Joi.array(),
  title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),
  announce: Joi.string().min(MIN_ANNOUNCE_LENGTH).max(MAX_ANNOUNCE_LENGTH),
  fullText: Joi.string().min(MIN_FULLTEXT_LENGTH).max(MAX_FULLTEXT_LENGTH),
  picture: Joi.string()
});

module.exports = articleBaseSchema;
