import express from 'express';
import http from 'http';
import router from './routers/index';
import logger from './Log';
const app = express();

app.use('/', router);
var port = process.env.PORT || 3000;
app.set('port', port);


var server = http.createServer(app);
server.listen(3000);
server.on('listening', onListening);


function onListening() {
  var addr:any = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    console.log(addr);
    console.log(bind);
}