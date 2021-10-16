'use strict';

const {readFile} = require(`fs/promises`);

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomInt = (min = 0, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const correctNounEnding = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  const units = 4;
  const doubles = 20;
  const otherCases = 5;
  const lastTitleIndex = 2;
  let titleIndex;

  if (number % 100 > units && number % 100 < doubles) {
    titleIndex = lastTitleIndex;
  } else {
    titleIndex = cases[(number % 10 < otherCases) ? number % 10 : otherCases];
  }

  return titles[titleIndex];
};

const getRandomDateFromPast = (dateShift) => {
  const currentDate = new Date();
  const millisecondsInOneDay = 60 * 60 * 24 * 1000;
  const shift = getRandomInt(0, dateShift);
  const result = new Date(currentDate.getTime() - (millisecondsInOneDay * shift));

  return `${result.toLocaleDateString()} ${result.toLocaleTimeString()}`;
};

const getCurrentDate = () => {
  const currentDate = new Date();
  return `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
};

const getMocks = async (fileName) => {
  try {
    const content = await readFile(fileName);
    return JSON.parse(content);
  } catch (err) {
    return console.error(`Что то пошло не так:`, err);
  }
};

const mostPopularArticles = (articles) => articles.sort((a, b) => b.comments.length - a.comments.length);

const lastComments = (articles) => {
  let allComments = [];
  articles.forEach((article) => article.comments.forEach((comment) => allComments.push({...comment, articleId: article.id})));
  return allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getPictureFileName = (count) => `item${count < 10 ? `0${count}` : count}.jpg`;

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  let result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

module.exports = {
  shuffle,
  getRandomInt,
  correctNounEnding,
  getRandomDateFromPast,
  getMocks,
  getCurrentDate,
  mostPopularArticles,
  getPictureFileName,
  getRandomSubarray,
  lastComments
};
