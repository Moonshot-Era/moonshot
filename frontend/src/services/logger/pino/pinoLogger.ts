// logger.js
import pino from 'pino';
import fs from 'fs';
import { createStream } from 'rotating-file-stream';

const logDir = `${process.env.PATH_TO_DEPLOY}`;

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isProduction = process.env.NODE_ENV === 'production';

const pinoLogger = pino(
  {
    formatters: {
      level: (label) => {
        return { level: label };
      }
    },
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime
  },

  createStream(
    () => {
      const date = new Date().toISOString();

      return `moonshot_${date.substring(0, 10)}.log`;
    },
    {
      interval: '1d', // rotate daily
      path: logDir
    }
  )
);

export const logger = {
  info: (...msg: any) =>
    !isProduction
      ? pinoLogger.info(msg)
      : console.log('\x1b[34m%s\x1b[0m', 'Info: ', ...msg),
  error: (...msg: any) =>
    !isProduction
      ? pinoLogger.error(msg)
      : console.log('\x1b[31m%s\x1b[0m', 'Error: ', ...msg)
};
