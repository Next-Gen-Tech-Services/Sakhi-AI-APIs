const { devLogger, prodLogger } = require("../utils/helpers/logger.util");

let log = null;

if (process.env.NODE_ENV === "production") {
  log = prodLogger();
  global.log = log;
}

if (process.env.NODE_ENV === "development") {
  log = devLogger();
  global.log = log;
}

module.exports = log;
