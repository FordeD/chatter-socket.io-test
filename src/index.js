var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../client/public/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Events
const User = require('./Events/User');
const Message = require('./Events/Message');
const Conversation = require('./Events/Conversation');
const Call = require('./Events/Call');
const System = require('./Events/System');

io.on('connection', (socket) => {
  console.log('User connected');

  User(io, socket);
  Message(io, socket);
  Conversation(io, socket);
  Call(io, socket);
  System(io, socket);
});