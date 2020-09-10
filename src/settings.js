const mongoose = require("mongoose");

var database;
try {
  database = mongoose.connect('mongodb://localhost:27017/test-chatter', { useNewUrlParser: true });
  console.log("Database connected");
} catch (error) {
  handleError(error);
}

module.exports = database;