let eventEmitter = require('./app.js');

eventEmitter.on('bar', () => console.log('woof'));

eventEmitter.emit('pet');