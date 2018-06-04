'use strict';

const EventEmitter = require('events');
const net = require('net');
const uuid = require('uuid/v4');
const port = process.env.PORT || 3000;
const server = net.createServer();
const eventEmitter = new EventEmitter();
const socketPool = {};
let usersList = [];
let adminList = [];


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
  user.socket.write(`
  * ~~~~ WELCOME !!! ~~~~
  * 
  * Commands are: 
  * @all (sends to all).
  * @nick + _yournick_ changes nickname.
  * @list will list all users with user names that are connected.
  * @count will show the number of users connected.
  * 
  * 
  
   `);
  adminList.push(` ${user.id}`);

  for( let userId in socketPool){
    let newUser = socketPool[userId];
    newUser.socket.write(`
    * 
    * User <${user.id}> connected.
    * 
    
    `);
  }
});

let parse = (buffer) => {

  let text = buffer.toString().trim();
  if(!text.startsWith('@')) {return null;}

  let [command,payload] = text.split(/\s+(.*)/);
  let [target,message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command,payload,target,message};

};

let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && eventEmitter.emit(entry.command, entry, userId);

};


/* ****************************************************
******* BREAKER * COMMANDS BELOW * ************
***************************************************** */
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
  usersList.push(` ${user.nickname}`);
  user.socket.write(`User <${user.id}> changed name to ${user.nickname}  `);

});


eventEmitter.on('@quit', (data, curUserId) =>{

  for( let userId in socketPool){
    let newUser = socketPool[userId];
    newUser.socket.write(`${userId.nickname} left the chat.`);
  }

  socketPool[curUserId].socket.destroy();
  delete socketPool[curUserId];
});



/* *********** AT LIST COMMAND ******************* */

eventEmitter.on('@list', (data, curUserId) =>{

  socketPool[curUserId].socket.write(`
  * The user(s) hashes online are: ${adminList}
  * The user(s) online with nicknames are ${usersList}
   ` );
});


/* ********** AT COUNT COMMAND ********************* */

eventEmitter.on('@count', (data, curUserId) =>{
  let userCount = socketPool[curUserId].socket.server._connections;
  socketPool[curUserId].socket.write(`
  * **
  * There are ${userCount} user(s) online.
  * **` );
});

eventEmitter.on('@dm', (data, curUserId) =>{
  let directUser = data.target;

  for(let direct in socketPool){
    if( directUser === socketPool[direct].nickname){
      let dirMsg = socketPool[direct];
      dirMsg.socket.write(`<${socketPool[curUserId].nickname}>: sent you a message: ${data.message}\n`);
    }
  }
 

});

/* **************** ADMIN TOOLS ONLY ********************* */

eventEmitter.on('@admin-tools', () =>{
  for(let userId in socketPool){
    let userNick = socketPool[userId].nickname;
    let user = socketPool[userId];
    let userCount = server.connections;
    user.socket.write(`Your user nick(s): ${userNick}. The/Their hash is : ${user.id}.` );
    user.socket.write(`
    * The user(s) online with nicknames are: ${usersList}  
    * The user hashes are ${adminList}
    * The user count is ${userCount}
 
  `);
  }
});

server.listen (port, () => {
  console.log(`port: ${port}`);
});

