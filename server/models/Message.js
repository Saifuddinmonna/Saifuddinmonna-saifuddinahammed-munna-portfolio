const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: false
  },
  senderRole: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 3000
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  receiverId: {
    type: String,
    required: false
  },
  roomId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Message', messageSchema); 