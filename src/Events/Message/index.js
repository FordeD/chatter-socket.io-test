const ConversationModel = require('../../Schemes/Conversation.Schema');
const UserModel = require('../../Schemes/User.Schema');
const MessageModel = require('../../Schemes/Message.Schema');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = (io, socket) => {
  socket.on('Message:send', async (conversation, text) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Message:send', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ _id: ObjectId(conversation) })

    if (!Conversation) {
      socket.emit('Message:send', { data: { type: "failure", msg: "Haven't this conversation" } });
      return
    }

    let Message = await MessageModel.create({
      conversation_id: conversation,
      text: text,
      user: User._id
    });

    io.in(Conversation.invite_link).emit('Message:send', { data: { type: "success", user: User._id, msg: text, id: Message._id } });

  });

  socket.on('Message:get', async (conversation, count, offset) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Message:get', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let messages = await MessageModel.find({ conversation_id: ObjectId(conversation) }, {}, { sort: { 'created_at': -1 } }).limit(count ? count : 100);

    socket.emit('Message:get', { data: { type: "success", list: messages, conversation: conversation } });
  });

  socket.on('Message:delete', async (conversation, message) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Message:delete', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ _id: ObjectId(conversation) });

    let Message = await MessageModel.findOne({ conversation_id: ObjectId(conversation), _id: ObjectId(message) });

    if (!Message) {
      socket.emit('Message:delete', { data: { type: "failure", msg: "Haven't this message" } });
      return
    }

    if (Message.user != User._id) {
      socket.emit('Message:delete', { data: { type: "failure", msg: "You are not a sender" } });
      return
    }

    await MessageModel.remove({ _id: ObjectId(message) });
    socket.in(Conversation.invite_link).emit('Message:delete', { data: { type: "success", msg: Message._id, state: "deleted" } });
  });

  socket.on('Message:edit', async (conversation, message, editedText) => {
    let User = await UserModel.findOne({ current_id: socket.id });
    if (!User) {
      socket.emit('Message:edit', { data: { type: "failure", msg: "You are not authorisated" } });
      return
    }

    let Conversation = await ConversationModel.findOne({ _id: ObjectId(conversation) });

    let Message = await MessageModel.findOne({ conversation_id: ObjectId(conversation), _id: ObjectId(message) });

    if (!Message) {
      socket.emit('Message:edit', { data: { type: "failure", msg: "Haven't this message" } });
      return
    }

    if (Message.user != User._id) {
      socket.emit('Message:edit', { data: { type: "failure", msg: "You are not a sender" } });
      return
    }

    await MessageModel.updateOne({ _id: ObjectId(message) }, { text: editedText });

    socket.emit('Message:edit', { data: { type: "success" } });
    socket.in(Conversation.invite_link).emit('Message:edit', { data: { type: "success", msg: Message._id, state: "edited", text: editedText } });
  });
};