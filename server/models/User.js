const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'guest'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isGuest: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  bannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  },
  adminActions: [{
    action: {
      type: String,
      enum: ['kick', 'ban', 'announcement'],
      required: true
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving (only if password exists)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method (only for registered users)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Record admin action
userSchema.methods.recordAdminAction = async function(action, target, reason) {
  this.adminActions.push({
    action,
    target,
    reason,
    timestamp: new Date()
  });
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
