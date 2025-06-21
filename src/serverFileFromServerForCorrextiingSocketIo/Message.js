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
  deliveredTo: [{
    userId: String,
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
});

// Compound indexes for efficient querying
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ messageType: 1, timestamp: -1 });
messageSchema.index({ receiverId: 1, status: 1 });
messageSchema.index({ 'readBy.userId': 1, timestamp: -1 });

// Virtual for unread count
messageSchema.virtual('isUnread').get(function() {
  return this.readBy.length === 0;
});

// Pre-save middleware to update status
messageSchema.pre('save', function(next) {
  if (this.isModified('readBy') && this.readBy.length > 0) {
    this.status = 'read';
  } else if (this.isModified('deliveredTo') && this.deliveredTo.length > 0) {
    this.status = 'delivered';
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema); 