const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
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
  receiverId: {
    type: String,
    required: true,
    index: true
  },
  receiverName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 3000
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
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
privateMessageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
privateMessageSchema.index({ receiverId: 1, read: 1 });
privateMessageSchema.index({ timestamp: -1 });

// Virtual for message status
privateMessageSchema.virtual('status').get(function() {
  if (this.read) return 'read';
  if (this.delivered) return 'delivered';
  return 'sent';
});

// Pre-save middleware to update timestamps
privateMessageSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read) {
    this.readAt = new Date();
  }
  if (this.isModified('delivered') && this.delivered) {
    this.deliveredAt = new Date();
  }
  if (this.isModified('edited') && this.edited) {
    this.editedAt = new Date();
  }
  if (this.isModified('deleted') && this.deleted) {
    this.deletedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema); 