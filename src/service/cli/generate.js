'use strict';

const {
  DEFAULT_COUNT,
  FILE_NAME,
  MAXIMUM_SENTENCES_ALLOWED,
  DATE_SHIFT,
  MOCKS_RESTRICTIONS,
  MAXIMUM_COMMENTS
} = require(`../mocks`);

const {
  getRandomInt,
  shuffle,
  correctNounEnding,
  getRandomDateFromPast
} = require(`../utils`);
const {nanoid} = require(`nanoid`);
const {writeFile, readFile} = require(`fs/promises`);
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

const generateOffers = (options) => {
  const {count, titles, categories, sentences, comments} = options;
  return Array(count).fill({}).map(() => ({
    id: nanoid(),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDateFromPast(DATE_SHIFT),
    announce: shuffle(sentences).slice(1, MAXIMUM_SENTENCES_ALLOWED).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    categories: [categories[getRandomInt(0, categories.length - 1)]],
    comments: Array(getRandomInt(1, MAXIMUM_COMMENTS)).fill({}).map(() => ({
      id: nanoid(),
      text: shuffle(comments).slice(1, sentences.length).join(` `)
    }))
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {

    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPosts > MOCKS_RESTRICTIONS.MAX) {
      return console.info(chalk.red(`Не больше ${MOCKS_RESTRICTIONS.MAX} ${correctNounEnding(MOCKS_RESTRICTIONS.MAX, [`пост`, `поста`, `постов`])}`));
    } else {
      const options = {
        count: countPosts,
        titles: await readContent(titlesPath),
        categories: await readContent(categoriesPath),
        sentences: await readContent(sentencesPath),
        comments: await readContent(commentsPath)
      };
      const content = JSON.stringify(generateOffers(options));

      try {
        await writeFile(FILE_NAME, content);
        return console.info(chalk.green(`Operation success. File created.`));
      } catch (e) {
        return console.error(chalk.red(`Can't write data to file...${e.message}`));
      }
    }
  }
};
