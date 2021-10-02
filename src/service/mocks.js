'use strict';

const DEFAULT_COUNT = 1;
const MOCKS_RESTRICTIONS = {
  MIN: 1,
  MAX: 1000
};

const FILE_NAME = `mocks.json`;
const MAXIMUM_SENTENCES_ALLOWED = 5;
const DATE_SHIFT = 90;
const MAXIMUM_COMMENTS = 5;
const MINIMUM_COMMENTS = 2;
const USERS = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    isBlogOwner: true,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    isBlogOwner: false,
    avatar: `avatar2.jpg`
  }
];
const PIC_RESTRICTIONS = {
  MIN: 1,
  MAX: 16
};

module.exports = {
  DEFAULT_COUNT,
  MOCKS_RESTRICTIONS,
  FILE_NAME,
  MAXIMUM_SENTENCES_ALLOWED,
  DATE_SHIFT,
  MAXIMUM_COMMENTS,
  MINIMUM_COMMENTS,
  USERS,
  PIC_RESTRICTIONS
};
