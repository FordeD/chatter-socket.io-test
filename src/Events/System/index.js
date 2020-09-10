const UserModel = require('../../Schemes/User.Schema');

module.exports = function (io, socket) {
  socket.on('disconnect', async () => {
    console.log('user disconnected');

    let currentUser = await UserModel.findOne({ current_id: socket.id });

    if (!currentUser) {
      return
    }

    socket.broadcast.emit('User:user_status', { data: { id: currentUser._id, socket: socket.id, type: "exit" } });

    await UserModel.update({ login: currentUser.login, password: currentUser.password }, { online: false, current_id: null });
  });
};