// @ts-nocheck
import env from 'src/configs/envVars';
import { createLogger, transports, format } from 'winston';
import type { Logger } from 'winston';

/**
 * @description Output directory
 */
const output = env.env === 'development' ? 'dev' : 'prod';

/**
 * @description Output Format
 */
const formatter = format.printf(
  ({ level, message, label, timestamp }) => `${timestamp} [${level}]: [${label}]:${message}`,
);

/**
 * @description Default transport options
 */
const options = {
  error: {
    level: 'error',
    format: format.combine(format.timestamp(), formatter),
    filename: `${process.cwd()}/logs/${output}/error.log`,
    handleExceptions: true,
    json: true,
    maxSize: 20971520, // 20MB
    maxFiles: 5,
    colorize: false,
  },
  info: {
    level: 'info',
    format: format.combine(format.timestamp(), formatter),
    filename: `${process.cwd()}/logs/${output}/combined.log`,
    handleExceptions: false,
    json: true,
    maxSize: 20971520, // 20MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    format: format.combine(format.colorize(), format.timestamp(), format.align(), formatter),
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

/**
 * @description Create Logger with options
 */
const logger: Logger = createLogger({
  level: 'info',
  transports: [
    /**
     * Write to all logs with level `info` and below to `combined.log`.
     * Write all logs error (and below) to `error.log`.
     */
    new transports.File(options.error),
    new transports.File(options.info),
  ],
  exitOnError: false,
});

if (env.env !== 'production') {
  logger.add(new transports.Console(options.console));
}

logger.stream = {
  /**
   * Message from incoming request
   *
   * @param {string} message
   */
  write(message: string) {
    logger.info(message.trim());
  },
};

/**
 * Enable Logging in Application
 *
 * @see https://npmjs.com/package/winston
 */
export default logger;
export const stream = logger.stream;
