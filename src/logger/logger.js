'use strict';

const logger = require(`pino`)({
  name: `pino-and-express`,
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: {
    levelFirst: true,
    translateTime: true,
    singleLine: true
  }
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
