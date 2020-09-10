module.exports = function (io, socket) {
  socket.on('Message:send', async (conversation, text) => {

  });

  socket.on('Message:get', async (conversation, count, offset) => {

  });

  socket.on('Message:delete', async (conversation, message) => {

  });

  socket.on('Message:edit', async (conversation, message, editedText) => {

  });
};