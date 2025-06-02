const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      id: String,
      name: String,
      email: String,
      photoURL: String,
      isGuest: Boolean,
    },
    room: {
      type: String,
      required: true,
      default: "general",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
