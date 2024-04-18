import winston from "winston";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  if (typeof info.message === "object") {
    info.message = JSON.stringify(info.message, null, 3);
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
