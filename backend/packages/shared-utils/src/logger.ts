/**
 * Logger Utility using Winston
 */

import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'json';

const formats =
    logFormat === 'json'
        ? [winston.format.timestamp(), winston.format.json()]
        : [
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                return `${timestamp} [${level}]: ${message} ${metaString}`;
            }),
        ];

export const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(...formats),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

// Development mode: add pretty printing
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export default logger;
