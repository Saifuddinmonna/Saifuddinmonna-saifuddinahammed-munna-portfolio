const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: String, // Firebase UID or user ID
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    members: [
      {
        id: {
          type: String, // Firebase UID or user ID
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
        },
        role: {
          type: String,
          enum: ["admin", "user", "guest"],
          default: "user",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    admins: [
      {
        type: String, // Firebase UID or user ID
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxMembers: {
      type: Number,
      default: 100,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
groupSchema.index({ name: "text", description: "text" });
groupSchema.index({ createdBy: 1 });
groupSchema.index({ "members.id": 1 });
groupSchema.index({ isActive: 1 });

// Virtual for member count
groupSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Method to check if user is member
groupSchema.methods.isMember = function (userId) {
  return this.members.some(member => member.id === userId);
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function (userId) {
  return this.admins.includes(userId) || this.createdBy === userId;
};

// Method to add member
groupSchema.methods.addMember = function (userData) {
  if (!this.isMember(userData.id)) {
    this.members.push({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      joinedAt: new Date(),
    });
  }
  return this;
};

// Method to remove member
groupSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter(member => member.id !== userId);
  this.admins = this.admins.filter(adminId => adminId !== userId);
  return this;
};

// Method to add admin
groupSchema.methods.addAdmin = function (userId) {
  if (!this.admins.includes(userId)) {
    this.admins.push(userId);
  }
  return this;
};

// Method to remove admin
groupSchema.methods.removeAdmin = function (userId) {
  this.admins = this.admins.filter(adminId => adminId !== userId);
  return this;
};

// Pre-save middleware to ensure creator is admin
groupSchema.pre("save", function (next) {
  if (this.isNew && !this.admins.includes(this.createdBy)) {
    this.admins.push(this.createdBy);
  }
  next();
});

module.exports = mongoose.model("Group", groupSchema);
