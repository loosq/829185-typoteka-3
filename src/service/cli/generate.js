'use strict';

const {
  DEFAULT_COUNT,
  TITLES,
  TEXTS,
  CATEGORIES
} = require(`../mocks`);

const {
  getRandomInt,
  shuffle,
  correctNounEnding,
  getRandomDateFromPast
} = require(`../utils`);

const {writeFile} = require(`fs/promises`);
const chalk = require(`chalk`);
const MOCKS_RESTRICTIONS = {
  MIN: 1,
  MAX: 1000
};

const FILE_NAME = `mocks.json`;
const maximumSentencesAllowed = 5;
const dateShift = 90;

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: getRandomDateFromPast(dateShift),
    announce: shuffle(TEXTS).slice(1, maximumSentencesAllowed).join(` `),
    fullText: shuffle(TEXTS).slice(1, TEXTS.length).join(` `),
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]]
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {

    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPosts > MOCKS_RESTRICTIONS.MAX) {
      console.info(chalk.red(`Не больше ${MOCKS_RESTRICTIONS.MAX} ${correctNounEnding(MOCKS_RESTRICTIONS.MAX, [`пост`, `поста`, `постов`])}`));
    } else {
      const content = JSON.stringify(generateOffers(countPosts));

      try {
        await writeFile(FILE_NAME, content);
      } catch (e) {
        console.error(chalk.red(`Can't write data to file...${e.message}`));
      }
    }

    return console.info(chalk.green(`Operation success. File created.`));
  }
};
