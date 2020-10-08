import express from 'express';
import router from './routers/index';
import logger from './Log';

const app = express();

app.use('/', router);

app.listen(3000, () => {
  logger.info('Listening on port 3000');
});
