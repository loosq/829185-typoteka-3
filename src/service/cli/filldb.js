'use strict';

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../../logger/logger`);
const initDB = require(`../lib/init-db`);

const {
  DEFAULT_COUNT,
  MAXIMUM_SENTENCES_ALLOWED,
  DATE_SHIFT,
  MOCKS_RESTRICTIONS,
  MAXIMUM_COMMENTS
} = require(`../mocks`);

const {
  getRandomInt,
  shuffle,
  correctNounEnding,
  getRandomDateFromPast,
  getRandomSubarray,
  getPictureFileName
} = require(`../utils`);
const {readFile} = require(`fs/promises`);
const chalk = require(`chalk`);
const titlesPath = `./data/titles.txt`;
const categoriesPath = `./data/categories.txt`;
const sentencesPath = `./data/sentences.txt`;
const commentsPath = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await readFile(filePath, `utf8`);
    return content.split(`\n`).filter((line) => line.trim().length > 0);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (options) => {
  const {count, titles, categories, sentences, comments} = options;
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDateFromPast(DATE_SHIFT),
    announce: shuffle(sentences).slice(1, MAXIMUM_SENTENCES_ALLOWED).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    picture: getPictureFileName(getRandomInt(1, 10)),
    categories: getRandomSubarray(categories),
    comments: Array(getRandomInt(1, MAXIMUM_COMMENTS)).fill({}).map(() => ({
      name: shuffle(comments).slice(1, getRandomInt(1, comments.length)).join(` `)
    }))
  }));
};
const logger = getLogger();

module.exports = {
  name: `--filldb`,
  async run(args) {

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    if (countArticles > MOCKS_RESTRICTIONS.MAX) {
      return console.info(chalk.red(`Не больше ${MOCKS_RESTRICTIONS.MAX} ${correctNounEnding(MOCKS_RESTRICTIONS.MAX, [`пост`, `поста`, `постов`])}`));
    } else {
      debugger
      const categories = await readContent(categoriesPath);
      const options = {
        count: countArticles,
        titles: await readContent(titlesPath),
        sentences: await readContent(sentencesPath),
        comments: await readContent(commentsPath),
        categories
      };
      const articles = generateArticles(options);
      await initDB(sequelize, {categories, articles});

      return console.info(chalk.green(`Operation success. Database is created.`));
    }
  }
};
