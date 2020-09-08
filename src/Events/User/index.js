module.exports = function (io, socket) {
  socket.on('User:register', (login, password) => {
    console.log('User:register', login, password);
    socket.emit('User:register', { data: { status: "success" } });
  });

  socket.on('User:auth', (login, password) => {
    console.log('User:auth', login, password);

    socket.emit('User:auth', { data: { status: "success", id: socket.id } });
    socket.broadcast.emit('Global:user_status', { data: { username: login, id: socket.id, type: "entered" } });
  });
};