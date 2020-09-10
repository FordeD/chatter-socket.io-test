const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation_id: String,
  text: String,
  user: String,
  date: { type: Date, default: Date.now }
});

const MessageModel = mongoose.model("Messages", MessageSchema);

module.exports = MessageModel;