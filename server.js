'use strict';

const http = require('http');
const parser = require('./parser.js');
const app = http.createServer(requestHandler);


module.exports = {
  start:(port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),

};