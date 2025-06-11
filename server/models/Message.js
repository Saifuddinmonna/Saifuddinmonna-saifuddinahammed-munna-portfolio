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
  messageType: {
    type: String,
    enum: ['public', 'private', 'group'],
    default: 'public',
    required: true
  },
  receiverId: {
    type: String,
    required: function() {
      return this.messageType === 'private';
    },
    index: true
  },
  groupId: {
    type: String,
    required: function() {
      return this.messageType === 'group';
    },
    index: true
  },
  groupName: {
    type: String,
    required: function() {
      return this.messageType === 'group';
    }
  },
  readBy: [{
    userId: String,
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ groupId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema); 