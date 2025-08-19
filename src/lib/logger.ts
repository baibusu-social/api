import pino, { Logger } from 'pino';
import dayjs from 'dayjs';
import { env } from '../env';

const logger: Logger = pino({
  name: 'API',
  level: env.LOG_LEVEL || 'info',
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: () => `,"time":"${dayjs().format('HH:mm')}"`,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default logger;
