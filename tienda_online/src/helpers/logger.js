import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const currentEnv = process.env.LOGGER;

// Definir los niveles de prioridad (de menor a mayor)
const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Logger de desarrollo
const devLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: "debug" })
  ]
});

// Logger de producción
const prodLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "./logs/errors.log", level: "error" })
  ]
});

// Definir el logger dependiendo del ambiente
export const addLogger = () => {
  let logger;
  if (currentEnv === "development") {
    logger = devLogger;
  } else {
    logger = prodLogger;
  }
  return logger;
};
