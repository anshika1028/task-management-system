import winston from "winston";

const { combine, timestamp, printf, colorize, align, json } = winston.format;

let _logger: winston.Logger;

function getLogger() {
  if (_logger) {
    return _logger;
  } else {
    // const errorFilter = winston.format((info, opts) => {
    //   return info.level === "error" ? info : false;
    // });

    // const infoFilter = winston.format((info, opts) => {
    //   return info.level === "info" ? info : false;
    // });

    _logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
      transports: [new winston.transports.Console()],
      //   level: process.env.LOG_LEVEL || "info",
      //   format: combine(
      //     colorize({ all: true }),
      //     timestamp({
      //       format: "YYYY-MM-DD hh:mm:ss.SSS A",
      //     }),
      //     align(),
      //     printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      //   ),
      //   transports: [new winston.transports.Console()],
      //   transports: [
      //     new winston.transports.File({
      //       filename: "combined.log",
      //     }),
      //     new winston.transports.File({
      //       filename: "app-error.log",
      //       level: "error",
      //       format: combine(errorFilter(), timestamp(), json()),
      //     }),
      //     new winston.transports.File({
      //       filename: "app-info.log",
      //       level: "info",
      //       format: combine(infoFilter(), timestamp(), json()),
      //     }),
      //   ],
    });
    return _logger;
  }
}

export const logger = getLogger();
