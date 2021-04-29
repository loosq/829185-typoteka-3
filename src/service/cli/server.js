'use strict';

const {HTTP_CODES} = require(`../constants`);
const {readFile} = require(`fs/promises`);
const chalk = require(`chalk`);
const DEFAULT_SERVER_PORT = 3000;
const FILENAME = `mocks.json`;

const express = require(`express`);
const app = express();

app.get(`/posts`, async (req, res) => {
  try {
    const content = await readFile(FILENAME);
    const mocks = JSON.parse(content);
    res.json(mocks);
  } catch (err) {
    console.error(chalk.red(`Что то пошло не так:`, err));
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
  }
});

app.use(express.json());
app.use((req, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(`Not found`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const serverPort = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;
    app.listen(serverPort, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`, err));
      }
      return console.info(chalk.green(`Ожидаю соединений на ${serverPort}`));
    });
  }
};
