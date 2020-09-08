module.exports = function (io, socket) {
  socket.on('disconnect', () => {
    console.log('user disconnected');

    socket.broadcast.emit('Global:user_status', { data: { id: socket.id, type: "exit" } });
  });

  socket.on('Global:list_users', () => {
    socket.emit('Global:user_status', { data: { type: "list", list: [] } });
  })
};