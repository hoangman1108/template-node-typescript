import database from './db';
import app from './app';
import config from './config/config';
import logger from './config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = new database();

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
