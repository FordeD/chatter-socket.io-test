const ConversationModel = require('../../Schemes/Conversation.Schema');
const UserModel = require('../../Schemes/User.Schema');
const Utils = require('../../Utils');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket) => {
  socket.on('Conversation:create', async () => {
    let Hash = Utils.genereHash(8);
    let isUser = await UserModel.exists({ current_id: socket.id });

    if (!isUser) {
      socket.emit('Conversation:create', { data: { status: "failure", msg: "You are not authorisated" } });
      return;
    }

    let currentUser = await UserModel.findOne({ current_id: socket.id });

    let today = new Date();
    let conversation = await ConversationModel.create({
      users: [currentUser._id],
      invite_link: Hash,
      name: "Беседа " + today.toISOString()
    });

    socket.emit('Conversation:create', { data: { status: "success", item: conversation } });

    socket.join(conversation.invite_link);
  });

  socket.on('Conversation:invite', async (conversation, user) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Conversation:invite', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ _id: ObjectId(conversation) });
    if (!Conversation) {
      socket.emit('Conversation:invite', { data: { type: "failure", msg: "You are not in this conversation" } });
      return
    }

    if (user && User._id == user) {
      socket.emit('Conversation:invite', { data: { type: "failure", msg: "You are can't invite yourself" } });
      return
    }

    let CurrentUser = await UserModel.findOne({ _id: ObjectId(user) });
    if (!CurrentUser) {
      socket.emit('Conversation:invite', { data: { type: "failure", msg: "This user not created" } });
      return
    }

    Conversation = await ConversationModel.updateOne({ _id: ObjectId(Conversation._id) }, { users: Conversation.users.push(users) });

    if (CurrentUser.online) {
      socket.to(CurrentUser.current_id).emit('Conversation:join', { data: { type: "success", item: Conversation } });
    }

    io.sockets.connected[CurrentUser.current_id].join(Conversation.invite_link);

    socket.emit('Conversation:invite', { data: { type: "success", item: Conversation } });
  });

  socket.on('Conversation:join', async (conversationUrl) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Conversation:join', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ invite_link: conversationUrl });
    if (!Conversation) {
      socket.emit('Conversation:join', { data: { type: "failure", msg: "Haven't this conversation" } });
      return
    }

    Conversation.users.push(User._id);

    Conversation = await ConversationModel.updateOne({ _id: ObjectId(Conversation._id) }, { users: Conversation.users });

    for (let i = 0; i < Conversation.users.length; i++) {
      let user = Conversation.users[i];
      let ConversationUser = await UserModel.findOne({ _id: ObjectId(user) });
      if (ConversationUser && ConversationUser.online) {
        socket.to(ConversationUser.current_id).emit('Conversation:update', { data: { type: "success", item: Conversation } });
      }
    }

    socket.join(conversations[i].invite_link);
  });

  socket.on('Conversation:left', async (conversation) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Conversation:left', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ _id: ObjectId(conversation) });
    if (!Conversation) {
      socket.emit('Conversation:left', { data: { type: "failure", msg: "You are not in this conversation" } });
      return
    }

    if (Conversation.users.length == 1 && Conversation.users[0] == User._id) {
      await ConversationModel.remove({ _id: ObjectId(conversation) });
    } else {
      let yourIndex = Conversation.users.indexOf(User._id);
      Conversation.users = Conversation.users.splice(yourIndex, 1);

      Conversation = await ConversationModel.updateOne({ _id: ObjectId(Conversation._id) }, { users: Conversation.users });

      for (let i = 0; i < Conversation.users.length; i++) {
        let user = Conversation.users[i];
        let ConversationUser = await UserModel.findOne({ _id: ObjectId(user) });
        if (ConversationUser && ConversationUser.online) {
          socket.to(ConversationUser.current_id).emit('Conversation:update', { data: { type: "success", item: Conversation } });
        }
      }
    }
    socket.leave(Conversation.invite_link);
    socket.emit('Conversation:left', { data: { type: "success" } });
  });

  socket.on('Conversation:list', async () => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Conversation:list', { data: { type: "list", list: [] } });
      return
    }

    let conversations = await ConversationModel.find({ 'users': { $in: [ObjectId(User._id)] } });

    for (let i = 0; i < conversations.length; i++) {
      socket.join(conversations[i].invite_link);
    }

    socket.emit('User:user_statuss', { data: { type: "list", list: conversations } });
  });
};