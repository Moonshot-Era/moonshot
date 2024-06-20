import pino, { Logger } from 'pino';
import { createStream } from 'rotating-file-stream';

const isProduction = process.env.NODE_ENV === 'production';

export const logger: Logger = pino(
  {
    formatters: {
      level: (label) => {
        return { level: label };
      }
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isProduction
      ? null
      : {
          transport: {
            target: isProduction ? '' : 'pino-pretty',
            options: {
              colorize: true
            }
          }
        }),
    level: 'info',

    redact: []
  },
  isProduction
    ? createStream(
        () => {
          const date = new Date().toISOString();

          return `moonshot_${date.substring(0, 10)}.log`;
        },
        {
          interval: '1d', // rotate daily
          path: '../logs'
        }
      )
    : undefined
);
