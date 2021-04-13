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

const fs = require(`fs`);

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
  run(args) {

    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPosts > MOCKS_RESTRICTIONS.MAX) {
      console.info(`Не больше ${MOCKS_RESTRICTIONS.MAX} ${correctNounEnding(MOCKS_RESTRICTIONS.MAX, [`пост`, `поста`, `постов`])}`);
    } else {
      const content = JSON.stringify(generateOffers(countPosts));

      fs.writeFile(FILE_NAME, content, (err) => {
        if (err) {
          return console.error(`Can't write data to file...`);
        }

        return console.info(`Operation success. File created.`);
      });
    }
  }
};
