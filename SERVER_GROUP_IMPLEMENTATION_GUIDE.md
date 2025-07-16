# Server-Side Group Functionality Implementation Guide

## 📋 Overview

এই guide এ আমরা Socket.IO server এ group functionality implement করব। Frontend এ group features already implemented আছে, এখন backend এ corresponding functionality add করতে হবে।

## 🗂️ Required Files Structure

```
server/
├── models/
│   ├── Group.js          # Group model
│   └── Message.js        # Message model (update for group messages)
├── socket/
│   ├── groupHandlers.js  # Group event handlers
│   └── index.js          # Main socket file
├── routes/
│   └── groupRoutes.js    # REST API routes for groups
└── server.js             # Main server file
```

## 1. 📊 Database Models

### Group Model (models/Group.js)

```javascript
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
      type: String, // user ID
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    members: [
      {
        id: String, // user ID
        name: String,
        email: String,
        role: {
          type: String,
          enum: ["member", "admin"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    admins: [
      {
        id: String, // user ID
        name: String,
        email: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
groupSchema.index({ name: "text", description: "text" });
groupSchema.index({ "members.id": 1 });
groupSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Group", groupSchema);
```

### Message Model Update (models/Message.js)

```javascript
// Add group message support to existing Message model
const messageSchema = new mongoose.Schema({
  // ... existing fields ...

  // Add these fields for group messages
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  messageType: {
    type: String,
    enum: ["public", "private", "group"],
    default: "public",
  },
});
```

## 2. 🔌 Socket.IO Group Handlers

### Group Event Handlers (socket/groupHandlers.js)

```javascript
const Group = require("../models/Group");
const Message = require("../models/Message");
const { validateUser } = require("../middleware/auth");

class GroupHandlers {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.user = socket.user;
  }

  // Create a new group
  async handleCreateGroup(data) {
    try {
      const { name, description, members } = data;

      // Validation
      if (!name || !name.trim()) {
        return this.socket.emit("error", { message: "Group name is required" });
      }

      // Check if user is admin
      if (this.user.role !== "admin") {
        return this.socket.emit("error", { message: "Only admins can create groups" });
      }

      // Create group
      const group = new Group({
        name: name.trim(),
        description: description?.trim() || "",
        createdBy: this.user.uid,
        creatorName: this.user.name,
        members: [
          {
            id: this.user.uid,
            name: this.user.name,
            email: this.user.email,
            role: "admin",
          },
          ...members.map(memberId => ({
            id: memberId,
            name: "User", // You'll need to fetch user details
            email: "user@example.com",
            role: "member",
          })),
        ],
        admins: [
          {
            id: this.user.uid,
            name: this.user.name,
            email: this.user.email,
          },
        ],
      });

      await group.save();

      // Emit to all users
      this.io.emit("groupCreated", {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
          createdBy: group.createdBy,
          creatorName: group.creatorName,
          members: group.members,
          memberCount: group.members.length,
        },
      });

      this.socket.emit("success", { message: "Group created successfully" });
    } catch (error) {
      console.error("Error creating group:", error);
      this.socket.emit("error", { message: "Failed to create group" });
    }
  }

  // Join a group
  async handleJoinGroup(groupId) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return this.socket.emit("error", { message: "Group not found" });
      }

      if (!group.isActive) {
        return this.socket.emit("error", { message: "Group is inactive" });
      }

      // Check if already a member
      const isMember = group.members.some(member => member.id === this.user.uid);
      if (isMember) {
        return this.socket.emit("error", { message: "Already a member of this group" });
      }

      // Add user to group
      group.members.push({
        id: this.user.uid,
        name: this.user.name,
        email: this.user.email,
        role: "member",
      });

      await group.save();

      // Emit to group members
      this.io.to(`group_${groupId}`).emit("userJoinedGroup", {
        groupId,
        user: {
          id: this.user.uid,
          name: this.user.name,
          email: this.user.email,
        },
      });

      // Join socket room
      this.socket.join(`group_${groupId}`);

      this.socket.emit("groupJoined", { groupId });
    } catch (error) {
      console.error("Error joining group:", error);
      this.socket.emit("error", { message: "Failed to join group" });
    }
  }

  // Leave a group
  async handleLeaveGroup(groupId) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return this.socket.emit("error", { message: "Group not found" });
      }

      // Check if user is a member
      const memberIndex = group.members.findIndex(member => member.id === this.user.uid);
      if (memberIndex === -1) {
        return this.socket.emit("error", { message: "Not a member of this group" });
      }

      // Check if user is creator
      if (group.createdBy === this.user.uid) {
        return this.socket.emit("error", {
          message: "Group creator cannot leave. Transfer ownership first.",
        });
      }

      // Remove user from group
      group.members.splice(memberIndex, 1);

      // Remove from admins if admin
      const adminIndex = group.admins.findIndex(admin => admin.id === this.user.uid);
      if (adminIndex !== -1) {
        group.admins.splice(adminIndex, 1);
      }

      await group.save();

      // Emit to group members
      this.io.to(`group_${groupId}`).emit("userLeftGroup", {
        groupId,
        userId: this.user.uid,
        userName: this.user.name,
      });

      // Leave socket room
      this.socket.leave(`group_${groupId}`);

      this.socket.emit("groupLeft", { groupId });
    } catch (error) {
      console.error("Error leaving group:", error);
      this.socket.emit("error", { message: "Failed to leave group" });
    }
  }

  // Get all groups
  async handleGetGroups() {
    try {
      const groups = await Group.find({ isActive: true })
        .select("name description createdBy creatorName members admins")
        .sort({ createdAt: -1 });

      this.socket.emit("groupsList", { groups });
    } catch (error) {
      console.error("Error getting groups:", error);
      this.socket.emit("error", { message: "Failed to get groups" });
    }
  }

  // Add user to group (admin only)
  async handleAddUserToGroup(data) {
    try {
      const { groupId, userId } = data;

      const group = await Group.findById(groupId);

      if (!group) {
        return this.socket.emit("error", { message: "Group not found" });
      }

      // Check if user is admin of the group
      const isAdmin = group.admins.some(admin => admin.id === this.user.uid);
      if (!isAdmin && this.user.role !== "admin") {
        return this.socket.emit("error", { message: "Only group admins can add users" });
      }

      // Check if user is already a member
      const isMember = group.members.some(member => member.id === userId);
      if (isMember) {
        return this.socket.emit("error", { message: "User is already a member" });
      }

      // Add user to group (you'll need to fetch user details)
      group.members.push({
        id: userId,
        name: "User Name", // Fetch from user service
        email: "user@example.com",
        role: "member",
      });

      await group.save();

      // Emit to group members
      this.io.to(`group_${groupId}`).emit("userAddedToGroup", {
        groupId,
        userId,
        addedBy: this.user.uid,
      });

      this.socket.emit("success", { message: "User added to group successfully" });
    } catch (error) {
      console.error("Error adding user to group:", error);
      this.socket.emit("error", { message: "Failed to add user to group" });
    }
  }

  // Remove user from group (admin only)
  async handleRemoveUserFromGroup(data) {
    try {
      const { groupId, userId } = data;

      const group = await Group.findById(groupId);

      if (!group) {
        return this.socket.emit("error", { message: "Group not found" });
      }

      // Check if user is admin of the group
      const isAdmin = group.admins.some(admin => admin.id === this.user.uid);
      if (!isAdmin && this.user.role !== "admin") {
        return this.socket.emit("error", { message: "Only group admins can remove users" });
      }

      // Check if trying to remove creator
      if (group.createdBy === userId) {
        return this.socket.emit("error", { message: "Cannot remove group creator" });
      }

      // Remove user from group
      const memberIndex = group.members.findIndex(member => member.id === userId);
      if (memberIndex === -1) {
        return this.socket.emit("error", { message: "User is not a member of this group" });
      }

      group.members.splice(memberIndex, 1);

      // Remove from admins if admin
      const adminIndex = group.admins.findIndex(admin => admin.id === userId);
      if (adminIndex !== -1) {
        group.admins.splice(adminIndex, 1);
      }

      await group.save();

      // Emit to group members
      this.io.to(`group_${groupId}`).emit("userRemovedFromGroup", {
        groupId,
        userId,
        removedBy: this.user.uid,
      });

      this.socket.emit("success", { message: "User removed from group successfully" });
    } catch (error) {
      console.error("Error removing user from group:", error);
      this.socket.emit("error", { message: "Failed to remove user from group" });
    }
  }

  // Handle group messages
  async handleGroupMessage(data) {
    try {
      const { groupId, text, type = "text" } = data;

      const group = await Group.findById(groupId);

      if (!group) {
        return this.socket.emit("error", { message: "Group not found" });
      }

      // Check if user is a member
      const isMember = group.members.some(member => member.id === this.user.uid);
      if (!isMember) {
        return this.socket.emit("error", { message: "You must be a member to send messages" });
      }

      // Create message
      const message = new Message({
        senderId: this.user.uid,
        senderName: this.user.name,
        senderEmail: this.user.email,
        text,
        type,
        groupId,
        messageType: "group",
        timestamp: new Date(),
      });

      await message.save();

      // Emit to group members
      this.io.to(`group_${groupId}`).emit("groupMessage", {
        message: {
          id: message._id,
          senderId: message.senderId,
          senderName: message.senderName,
          text: message.text,
          type: message.type,
          timestamp: message.timestamp,
          groupId: message.groupId,
        },
      });
    } catch (error) {
      console.error("Error sending group message:", error);
      this.socket.emit("error", { message: "Failed to send message" });
    }
  }

  // Get group message history
  async handleGetGroupHistory(groupId) {
    try {
      const messages = await Message.find({
        groupId,
        messageType: "group",
      })
        .sort({ timestamp: 1 })
        .limit(50);

      this.socket.emit("groupMessageHistory", {
        groupId,
        messages,
      });
    } catch (error) {
      console.error("Error getting group history:", error);
      this.socket.emit("error", { message: "Failed to get message history" });
    }
  }
}

module.exports = GroupHandlers;
```

## 3. 🔌 Main Socket File Update

### Socket Index (socket/index.js)

```javascript
const GroupHandlers = require("./groupHandlers");

// In your socket connection handler
socket.on("createGroup", data => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleCreateGroup(data);
});

socket.on("joinGroup", groupId => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleJoinGroup(groupId);
});

socket.on("leaveGroup", groupId => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleLeaveGroup(groupId);
});

socket.on("getGroups", () => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleGetGroups();
});

socket.on("addUserToGroup", data => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleAddUserToGroup(data);
});

socket.on("removeUserFromGroup", data => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleRemoveUserFromGroup(data);
});

socket.on("groupMessage", data => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleGroupMessage(data);
});

socket.on("getGroupHistory", groupId => {
  const groupHandler = new GroupHandlers(io, socket);
  groupHandler.handleGetGroupHistory(groupId);
});
```

## 4. 🌐 REST API Routes (Optional)

### Group Routes (routes/groupRoutes.js)

```javascript
const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const { authenticateToken } = require("../middleware/auth");

// Get all groups
router.get("/", authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true })
      .select("name description createdBy creatorName members admins")
      .sort({ createdAt: -1 });

    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get group by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get group members
router.get("/:id/members", authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).select("members");
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.json({ success: true, members: group.members });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
```

## 5. 🔧 Implementation Steps

### Step 1: Database Setup

```bash
# Create Group model
# Update Message model for group support
# Add indexes for better performance
```

### Step 2: Socket Handlers

```bash
# Create groupHandlers.js
# Implement all group event handlers
# Add error handling and validation
```

### Step 3: Main Socket Integration

```bash
# Update socket/index.js
# Add group event listeners
# Test socket connections
```

### Step 4: Testing

```bash
# Test group creation
# Test joining/leaving groups
# Test group messaging
# Test admin functions
```

## 6. 🧪 Testing Checklist

- [ ] Group creation (admin only)
- [ ] Joining groups
- [ ] Leaving groups
- [ ] Group messaging
- [ ] Message history
- [ ] Admin functions (add/remove users)
- [ ] Error handling
- [ ] Real-time updates
- [ ] Socket room management

## 7. 🔒 Security Considerations

- [ ] Admin role validation
- [ ] Group membership validation
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] User authentication
- [ ] Group privacy settings

## 8. 📈 Performance Optimizations

- [ ] Database indexes
- [ ] Message pagination
- [ ] Socket room management
- [ ] Caching strategies
- [ ] Connection pooling

এই guide follow করে আপনি server side group functionality implement করতে পারবেন। Frontend এ যা যা implemented আছে, তার সবই backend এ handle করতে হবে।
