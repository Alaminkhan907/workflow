const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
  time: { type: String, required: true },
});
const ChatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  messages: [MessageSchema],
});
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
