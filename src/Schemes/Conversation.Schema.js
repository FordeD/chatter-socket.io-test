const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  users: [],
  invite_link: String,
  reg_date: { type: Date, default: Date.now },
  name: String
});

const ConversationModel = mongoose.model("Conversations", ConversationSchema);

module.exports = ConversationModel;