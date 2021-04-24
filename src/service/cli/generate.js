'use strict';

const {
  DEFAULT_COUNT,
  FILE_NAME,
  MAXIMUM_SENTENCES_ALLOWED,
  DATE_SHIFT,
  MOCKS_RESTRICTIONS
} = require(`../mocks`);

const {
  getRandomInt,
  shuffle,
  correctNounEnding,
  getRandomDateFromPast
} = require(`../utils`);

const {writeFile, readFile} = require(`fs/promises`);
const chalk = require(`chalk`);
const titlesPath = `./data/titles.txt`;
const categoriesPath = `./data/categories.txt`;
const sentencesPath = `./data/sentences.txt`;

const readContent = async (filePath) => {
  try {
    const content = await readFile(filePath, `utf8`);
    return content.split(`\n`).filter((line) => line.trim().length > 0);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDateFromPast(DATE_SHIFT),
    announce: shuffle(sentences).slice(1, MAXIMUM_SENTENCES_ALLOWED).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]]
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {

    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const titles = await readContent(titlesPath);
    const categories = await readContent(categoriesPath);
    const sentences = await readContent(sentencesPath);

    if (countPosts > MOCKS_RESTRICTIONS.MAX) {
      return console.info(chalk.red(`Не больше ${MOCKS_RESTRICTIONS.MAX} ${correctNounEnding(MOCKS_RESTRICTIONS.MAX, [`пост`, `поста`, `постов`])}`));
    } else {
      const content = JSON.stringify(generateOffers(countPosts, titles, categories, sentences));

      try {
        await writeFile(FILE_NAME, content);
        return console.info(chalk.green(`Operation success. File created.`));
      } catch (e) {
        return console.error(chalk.red(`Can't write data to file...${e.message}`));
      }
    }
  }
};
