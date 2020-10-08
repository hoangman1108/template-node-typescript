import pino from 'pino';
import { env } from './Config';

const logger = pino({
  safe: true,
  prettyPrint: env === 'dev',
});
export default logger;
