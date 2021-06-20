'use strict';

const {HTTP_CODES, JSON_LIMIT} = require(`../constants`);
const DEFAULT_SERVER_PORT = 3000;
const express = require(`express`);
const app = express();
const initApi = require(`../api`);
const FILENAME = `mocks.json`;
const {getMocks} = require(`../utils`);
const {getLogger} = require(`../../logger/logger`);
const logger = getLogger();

app.use(express.json({limit: JSON_LIMIT}));

module.exports = {
  app,
  name: `--server`,
  async run(args) {
    const mocks = await getMocks(FILENAME);
    const routes = initApi(mocks);

    app.use((req, res, next) => {
      logger.debug(`Start request to url ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${req.statusCode}`);
      })
      next();
    });

    app.use(`/api`, routes);
    app.use((req, res) => {
      res.status(HTTP_CODES.NOT_FOUND).send(`Not found`);
    });
    const [customPort] = args;
    const serverPort = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;
    app.listen(serverPort, (err) => {
      if (err) {
        return logger.error(`Server creation error`, err);
      }
      return logger.info(`Waiting connections on port: ${serverPort}`);
    });
  }
};
