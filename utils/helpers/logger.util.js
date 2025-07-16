const winston = require("winston");
const { combine, timestamp, printf, colorize } = winston.format;

const devLoggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const devLogger = () => {
  return winston.createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "HH:mm:ss" }),
      devLoggerFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [new winston.transports.Console()],
  });
};

const prodLogger = () => {
  return winston.createLogger({
    level: "info",
    format: combine(timestamp(), devLoggerFormat),
    // defaultMeta: { service: "user-service" },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "infoLogs.log",
        dirname: "logs",
        level: "info",
      }),
      new winston.transports.File({
        filename: "errorLogs.log",
        dirname: "logs",
        level: "error",
      }),
    ],
  });
};

module.exports = { devLogger, prodLogger };
