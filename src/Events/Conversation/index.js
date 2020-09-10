const ConversationModel = require('../../Schemes/Conversation.Schema');
const UserModel = require('../../Schemes/User.Schema');
const Utils = require('../../Utils');

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
    ConversationModel.create({
        users: [currentUser._id],
        invite_link: Hash,
        name: "Беседа "+today.toISOString()
    })
  });

  socket.on('Conversation:invite', async (conversation, users) => {

  });

  socket.on('Conversation:join', async (conversationUrl) => {

  });

  socket.on('Conversation:left', async (conversation) => {

  });

  socket.on('Conversation:list', async () => {
    
  });
};