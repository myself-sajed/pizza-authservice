import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "Auth Service",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combine.log",
            level: "info",
            silent: Config.NODE_ENV === "production",
        }),

        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: Config.NODE_ENV === "production",
        }),

        new winston.transports.Console({
            level: "info",
        }),
    ],
});

export default logger;
