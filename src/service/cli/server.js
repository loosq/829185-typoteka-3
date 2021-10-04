'use strict';

const {HTTP_CODES, JSON_LIMIT} = require(`../constants`);
const DEFAULT_SERVER_PORT = 3000;
const express = require(`express`);
const app = express();
const {getLogger} = require(`../../logger/logger`);
const logger = getLogger({name: `API`});
const sequelize = require(`../../service/lib/sequelize`);
const apiRoutes = require(`../api`);

app.use(express.json({limit: JSON_LIMIT}));

module.exports = {
  app,
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const serverPort = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    app.use((req, res, next) => {
      const {method, query, params, body} = req;
      logger.info(`Start request to url ${req.url}`);
      logger.debug({method, query, params, body});

      res.on(`finish`, () => {
        logger.info(`Response status code ${req.statusCode}`);
      });
      next();
    });

    app.use(`/api`, apiRoutes);
    app.use((req, res) => {
      res.status(HTTP_CODES.NOT_FOUND).send(`Not found`);
    });
    app.listen(serverPort, (err) => {
      if (err) {
        return logger.error(`Server creation error`, err);
      }
      return logger.info(`Waiting connections on port: ${serverPort}`);
    });
  }
};
