const UserModel = require('../../Schemes/User.Schema');

module.exports = (io, socket) => {
  socket.on('User:register', async (login, password, name, surname) => {
    console.log('User:register', login, password);
    let isFound = await UserModel.exists({ login: login });
    if (isFound) {
      socket.emit('User:register', { data: { status: "failure", msg: "login already exist" } });
      return;
    }

    let createdUser = await UserModel.create({
      login: login,
      password: password,
      reg_date: new Date(),
      name: name,
      surname: surname
    });

    if (!createdUser) {
      socket.emit('User:register', { data: { status: "failure", msg: "server error on register" } });
      return;
    }

    socket.emit('User:register', { data: { status: "success" } });
  });

  socket.on('User:auth', async (login, password) => {
    console.log('User:auth', login, password);

    let isFound = await UserModel.exists({ login: login });
    if (!isFound) {
      socket.emit('User:register', { data: { status: "failure", msg: "user not created" } });
      return;
    }

    let currentUser = await UserModel.findOne({ login: login, password: password });

    if (!currentUser) {
      socket.emit('User:register', { data: { status: "failure", msg: "server error on auth" } });
      return;
    }

    await UserModel.updateOne({ login: login, password: password }, { online: true, current_id: socket.id });

    currentUser.id = socket.id;
    socket.emit('User:auth', { data: { status: "success", item: { currentUser } } });

    socket.broadcast.emit('User:user_status', { data: { username: login, id: currentUser._id, socket: socket.id, name: currentUser.name, surname: currentUser.surname, type: "entered" } });
  });

  socket.on('User:get', async (user_id) => {
    let currentUser = await UserModel.findOne({ _id: user_id });

    if (!currentUser) {
      socket.emit('User:get', { data: { status: "failure", msg: "server error on user get" } });
      return;
    }

    delete currentUser.password;

    socket.emit('User:get', { data: { status: "success", item: { currentUser } } });
  });

  socket.on('User:list', async () => {

    let baseUsers = await UserModel.find({});
    if (!baseUsers || baseUsers.length) {
      socket.emit('User:user_status', { data: { type: "list", list: [] } });
      return
    }

    let listOfUsers = baseUsers.map((user) => {
      delete user.password;
      user.socket = user.current_id;
      user.id = user._id;
      return user;
    });

    socket.emit('User:user_statuss', { data: { type: "list", list: listOfUsers } });
  }
  );
};