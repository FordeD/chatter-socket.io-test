const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: String,
  password: String,
  reg_date: { type: Date, default: Date.now },
  name: String,
  surname: String,
  current_id: String,
  online: Boolean
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;