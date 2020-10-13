import express from 'express';
import http from 'http';
import router from './routers/index';
import logger from './Log';
const app = express();

app.use('/', router);



var server = http.createServer(app);
server.listen(3000, () => {
  logger.info('Listening on port 3000');
});
