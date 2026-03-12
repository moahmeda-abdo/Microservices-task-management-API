import pino, { Logger } from "pino";

function buildLogger(serviceName: string): Logger {
  return pino({
    name: serviceName,
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV === "development"
        ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
        : undefined,
    base: {
      service: serviceName,
    },
  });
}

let loggerInstance: Logger = buildLogger(
  process.env.SERVICE_NAME || "unknown-service"
);

export function initializeLogger(serviceName: string): Logger {
  loggerInstance = buildLogger(serviceName);
  return loggerInstance;
}

export const logger = new Proxy({} as Logger, {
  get(_, prop, receiver) {
    return Reflect.get(loggerInstance, prop, receiver);
  },
});

export function getLogger(): Logger {
  return loggerInstance;
}