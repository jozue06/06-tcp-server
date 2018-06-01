'use strict';

let eventEmitter = require('./app.js');

module.exports = exports = {};

exports.fire = () => {
  eventEmitter.emit('start');
  eventEmitter.emit('stop');
};