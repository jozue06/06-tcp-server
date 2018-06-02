'use strict';


// firsts
const EventEmitter = require('events');
const net = require('net');




// thirds
const uuid = require('uuid/v4');
const port = process.env.PORT || 3000;
const server = net.createServer();
const eventEmitter = new EventEmitter();
const socketPool = {};


let User = function(socket){
  let id = uuid();
  this.id = id;
  this.nickname = `User-${id}`;
  this.socket = socket;
};


server.on('connection', (socket) => {
  let user = new User(socket);
  socketPool[user.id] = user;
  socket.on('data', (buffer) => dispatchAction(user.id, buffer));
});

let parse = (buffer) => {

  let text = buffer.toString().trim();
  if( !text.startsWith('@')) {return null;}
  let [command,payload] = text.split(/\s+(.*)/);
  let [target,message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command,payload,target,message};

};

let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && eventEmitter.emit(entry.command, entry, userId);
  // notLogged in && login

};

eventEmitter.on('@all', (data, userId)=>{

  for(let connection in socketPool) {
    let user = socketPool[connection];
    user.socket.write(`<${socketPool[userId].nickname}>: ${data.payload}\n`);
  }
});

eventEmitter.on('@nick',(data, userId)=>{
  let user = socketPool[userId];
  user.nickname = data.target;

  socketPool[userId].nickname = data.target;
});

eventEmitter.on('@quit', (data, userId) =>{
  let user = socketPool[userId];
  user.socket.close();
});


eventEmitter.on('@list', (data) =>{
  for(let userId in socketPool){

    let user = socketPool[userId];

    console.log(`users online :  ${socketPool[user.id].socket.server._connections} user hash is : ${user.nickname} payload: ${data.target}` );
    user.socket.write(`users online :  ${socketPool[user.id].socket.server._connections} user hash is : ${user.nickname}` );
  }
});

// data.target == whos getting it
// data.message == the message
// find socketPool[target].socket.write(message);


server.listen (port, ()=>{
  console.log(`port: ${port}`);
});
