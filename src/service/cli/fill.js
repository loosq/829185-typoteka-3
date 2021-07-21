'use strict';

const {
  DEFAULT_COUNT,
  MAXIMUM_SENTENCES_ALLOWED,
  PIC_RESTRICTIONS,
  MOCKS_RESTRICTIONS,
  MAXIMUM_COMMENTS,
  MINIMUM_COMMENTS,
  USERS
} = require(`../mocks`);

const FILE_NAME = `fill-db.sql`;
const {
  getRandomInt,
  shuffle,
  correctNounEnding,
  getPictureFileName
} = require(`../utils`);
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
const generateComments = (count, postId, userCount, comments) => {

  return Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    postId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generatePosts = ({count, titles, categories, sentences, comments}) => {

  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, USERS.length),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(1, MAXIMUM_SENTENCES_ALLOWED).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    categories: [getRandomInt(0, categories.length - 1)],
    picture: getPictureFileName(getRandomInt(PIC_RESTRICTIONS.MIN, PIC_RESTRICTIONS.MAX)),
    comments: generateComments(getRandomInt(MINIMUM_COMMENTS, MAXIMUM_COMMENTS), index + 1, USERS.length, comments)
  }));
};

module.exports = {
  name: `--fill`,
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

      const posts = generatePosts(options);
      const comments = posts.flatMap((post) => post.comments);
      const postCategories = posts.map((post, index) => ({postId: index + 1, categoryId: post.categories[0]}));
      const userValues = USERS.map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      ).join(`,\n`);

      const categoryValues = options.categories.map((name) => `('${name}')`).join(`,\n`);

      const postValues = posts.map(
          ({title, announce, fullText, picture, userId}) =>
            `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
      ).join(`,\n`);

      const postCategoryValues = postCategories.map(
          ({postId, categoryId}) =>
            `(${postId}, ${categoryId})`
      ).join(`,\n`);

      const commentValues = comments.map(
          ({text, userId, postId}) =>
            `('${text}', ${userId}, ${postId})`
      ).join(`,\n`);

      const content = `
            INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
            ${userValues};
            INSERT INTO categories(name) VALUES
            ${categoryValues};
            ALTER TABLE posts DISABLE TRIGGER ALL;
            INSERT INTO posts(title, announce, fullText, picture, user_id) VALUES
            ${postValues};
            ALTER TABLE posts ENABLE TRIGGER ALL;
            ALTER TABLE post_categories DISABLE TRIGGER ALL;
            INSERT INTO post_categories(post_id, category_id) VALUES
            ${postCategoryValues};
            ALTER TABLE post_categories ENABLE TRIGGER ALL;
            ALTER TABLE comments DISABLE TRIGGER ALL;
            INSERT INTO COMMENTS(text, user_id, post_id) VALUES
            ${commentValues};
            ALTER TABLE comments ENABLE TRIGGER ALL;`;

      try {
        await writeFile(FILE_NAME, content);
        return console.info(chalk.green(`Operation success. File created.`));
      } catch (e) {
        return console.error(chalk.red(`Can't write data to file...${e.message}`));
      }
    }
  }
};
