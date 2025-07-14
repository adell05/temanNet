const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: String, // ID dari pengguna yang memiliki teman ini
});

module.exports = mongoose.model("Friend", friendSchema);
