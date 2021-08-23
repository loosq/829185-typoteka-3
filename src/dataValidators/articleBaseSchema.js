'use strict';

const Joi = require(`joi`);
const minTitleLength = 10;
const maxTitleLength = 100;
const minAnnounceLength = 50;
const maxAnnounceLength = 1000;
const minFullTextLength = 50;
const maxFullTextLength = 2000;

const articleBaseSchema = Joi.object({
  categories: Joi.array(),
  title: Joi.string().min(minTitleLength).max(maxTitleLength),
  announce: Joi.string().min(minAnnounceLength).max(maxAnnounceLength),
  fullText: Joi.string().min(minFullTextLength).max(maxFullTextLength),
  picture: Joi.string()
});

module.exports = articleBaseSchema;
