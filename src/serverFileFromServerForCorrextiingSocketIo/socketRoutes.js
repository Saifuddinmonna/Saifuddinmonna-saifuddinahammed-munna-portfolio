const admin = require("firebase-admin");
const mongoose = require("mongoose");
const User = require("./User");
const Message = require("./Message");
const PrivateMessage = require("./PrivateMessage");
const Group = require("./Group");
const GuestUser = require("./GuestUser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Store connected users with their details
const connectedUsers = new Map();
// Store active groups
const activeGroups = new Map();
// Store user ID to socket ID mapping
const userSocketMap = new Map();
// Store room participants
const roomParticipants = new Map();

// Utility functions
const getUserDetails = socketId => {
  return connectedUsers.get(socketId);
};

const getSocketIdByUserId = userId => {
  return userSocketMap.get(userId);
};

const isUserOnline = userId => {
  return userSocketMap.has(userId);
};

const joinRoom = (socket, roomId) => {
  socket.join(roomId);
  if (!roomParticipants.has(roomId)) {
    roomParticipants.set(roomId, new Set());
  }
  const user = getUserDetails(socket.id);
  if (user) {
    roomParticipants.get(roomId).add(user.uid);
  }
};

const leaveRoom = (socket, roomId) => {
  socket.leave(roomId);
  const user = getUserDetails(socket.id);
  if (user && roomParticipants.has(roomId)) {
    roomParticipants.get(roomId).delete(user.uid);
    if (roomParticipants.get(roomId).size === 0) {
      roomParticipants.delete(roomId);
    }
  }
};

// Add this authentication function
const authenticateSocket = async token => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      // Try Firebase token first
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        uid: decodedToken.uid,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (firebaseError) {
      // If Firebase token fails, try JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      return {
        uid: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
};

// Add token expiration check function
const checkTokenExpiration = async token => {
  try {
    // Try Firebase token first
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      isValid: true,
      expiresIn: decodedToken.exp * 1000 - Date.now(), // Convert to milliseconds
    };
  } catch (firebaseError) {
    if (firebaseError.code === "auth/id-token-expired") {
      return {
        isValid: false,
        error: "Token expired",
      };
    }

    // Try JWT if Firebase fails
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        isValid: true,
        expiresIn: decoded.exp * 1000 - Date.now(), // Convert to milliseconds
      };
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return {
          isValid: false,
          error: "Token expired",
        };
      }
      throw jwtError;
    }
  }
};

// Message handlers
const handlePrivateMessage = async (io, socket, messageData) => {
  try {
    const user = getUserDetails(socket.id);
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!messageData.receiverId) {
      throw new Error("Receiver ID is required");
    }

    // Get receiver details
    const receiver = await User.findOne({
      $or: [{ firebaseUid: messageData.receiverId }, { _id: messageData.receiverId }],
    });

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Create and save private message
    const newPrivateMessage = new PrivateMessage({
      senderId: user.uid,
      senderName: user.name,
      senderEmail: user.email,
      receiverId: receiver.firebaseUid || receiver._id,
      receiverName: receiver.name,
      text: messageData.text,
      type: messageData.type || "text",
      delivered: false,
      read: false,
    });

    const savedMessage = await newPrivateMessage.save();
    console.log("Private message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.text,
      type: savedMessage.type,
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        email: user.email,
      },
      receiver: {
        uid: receiver.firebaseUid || receiver._id,
        name: receiver.name,
        email: receiver.email,
      },
      timestamp: savedMessage.timestamp,
      status: savedMessage.status,
      read: savedMessage.read,
      delivered: savedMessage.delivered,
    };

    const receiverSocketId = getSocketIdByUserId(receiver.firebaseUid || receiver._id);
    console.log("Receiver socket ID:", receiverSocketId);

    if (receiverSocketId) {
      // Send to receiver
      io.to(receiverSocketId).emit("privateMessage", message);
      console.log("Message sent to receiver:", receiverSocketId);

      // Update message status to delivered
      savedMessage.delivered = true;
      savedMessage.deliveredAt = new Date();
      await savedMessage.save();

      // Send delivery confirmation to sender
      socket.emit("messageDelivered", {
        messageId: savedMessage._id,
        receiverId: receiver.firebaseUid || receiver._id,
        status: "delivered",
      });

      // Send back to sender
      socket.emit("privateMessage", message);
      console.log("Message sent back to sender:", socket.id);
    } else {
      console.log("Receiver is offline:", receiver.firebaseUid || receiver._id);
      socket.emit("error", {
        success: false,
        message: "User is offline",
        error: "The recipient is not currently online",
      });
    }

    // Send updated message history
    await sendUpdatedPrivateHistory(io, socket, user.uid, receiver.firebaseUid || receiver._id);
  } catch (error) {
    console.error("Private message error:", error);
    socket.emit("error", {
      success: false,
      message: "Failed to send private message",
      error: error.message,
    });
  }
};

// Helper function to send updated private message history
const sendUpdatedPrivateHistory = async (io, socket, userId1, userId2) => {
  try {
    const messageHistory = await PrivateMessage.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      deleted: false,
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    const formattedHistory = messageHistory.reverse().map(msg => ({
      id: msg._id,
      text: msg.text,
      type: msg.type,
      sender: {
        uid: msg.senderId,
        name: msg.senderName,
        email: msg.senderEmail,
      },
      receiver: {
        uid: msg.receiverId,
        name: msg.receiverName,
      },
      timestamp: msg.timestamp,
      status: msg.status,
      read: msg.read,
      delivered: msg.delivered,
      edited: msg.edited,
      editedAt: msg.editedAt,
    }));

    // Send to both users if they're online
    const user1Socket = getSocketIdByUserId(userId1);
    const user2Socket = getSocketIdByUserId(userId2);

    if (user1Socket) {
      io.to(user1Socket).emit("privateMessageHistory", formattedHistory);
    }
    if (user2Socket) {
      io.to(user2Socket).emit("privateMessageHistory", formattedHistory);
    }
  } catch (error) {
    console.error("Error sending updated private history:", error);
  }
};

const handleRoomMessage = async (io, socket, messageData) => {
  try {
    console.log("Received room message:", messageData);
    const user = getUserDetails(socket.id);
    if (!user) {
      console.log("User not found for socket:", socket.id);
      return;
    }

    // Check if user is member of the group
    const group = await Group.findById(messageData.roomId);
    if (!group || !group.isMember(user.uid)) {
      socket.emit("error", {
        success: false,
        message: "You are not a member of this group",
      });
      return;
    }

    const newMessage = new Message({
      senderId: user.uid,
      senderName: user.name,
      senderEmail: user.email,
      senderRole: user.role,
      message: messageData.text,
      messageType: "room",
      roomId: messageData.roomId,
      roomName: group.name,
      readBy: [
        {
          userId: user.uid,
          readAt: new Date(),
        },
      ],
    });

    const savedMessage = await newMessage.save();
    console.log("Room message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.message,
      type: "room",
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      roomId: savedMessage.roomId,
      roomName: savedMessage.roomName,
      timestamp: savedMessage.timestamp,
      readBy: savedMessage.readBy,
    };

    // Send to all room participants
    io.to(messageData.roomId).emit("roomMessage", message);
    console.log("Message sent to room:", messageData.roomId);

    // Send room message history
    const messageHistory = await Message.find({
      roomId: messageData.roomId,
      messageType: "room",
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    io.to(messageData.roomId).emit("roomMessageHistory", messageHistory.reverse());
  } catch (error) {
    console.error("Room message error:", error);
    socket.emit("error", {
      success: false,
      message: "Failed to send room message",
      error: error.message,
    });
  }
};

const handlePublicMessage = async (io, socket, messageData) => {
  try {
    console.log("Received public message:", messageData);
    const user = getUserDetails(socket.id);
    if (!user) {
      console.log("User not found for socket:", socket.id);
      return;
    }

    // Create and save message in database
    const newMessage = new Message({
      senderId: user.uid,
      senderName: user.name,
      senderEmail: user.email,
      senderRole: user.role,
      message: messageData.text,
      messageType: "public",
      readBy: [
        {
          userId: user.uid,
          readAt: new Date(),
        },
      ],
    });

    const savedMessage = await newMessage.save();
    console.log("Public message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.message,
      type: "public",
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      timestamp: savedMessage.timestamp,
      readBy: savedMessage.readBy,
    };

    // Broadcast to all connected users
    io.emit("publicMessage", message);
    console.log("Public message broadcasted to all users");

    // Send updated message history to all users
    const messageHistory = await Message.find({
      messageType: "public",
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    io.emit("publicMessageHistory", messageHistory.reverse());
  } catch (error) {
    console.error("Public message error:", error);
    socket.emit("error", {
      success: false,
      message: "Failed to send public message",
      error: error.message,
    });
  }
};

const initializeSocketIo = io => {
  io.on("connection", async socket => {
    console.log("New client connected:", socket.id);
    let tokenExpirationTimer = null;

    // Handle user joining with token
    socket.on("userJoin", async userData => {
      try {
        if (!userData.token) {
          throw new Error("Authentication token required");
        }

        // Check token expiration
        const tokenStatus = await checkTokenExpiration(userData.token);
        if (!tokenStatus.isValid) {
          throw new Error(tokenStatus.error);
        }

        const user = await authenticateSocket(userData.token);

        // Store user data
        connectedUsers.set(socket.id, {
          id: socket.id,
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
          joinedAt: new Date(),
        });

        // Store user ID to socket ID mapping
        userSocketMap.set(user.uid, socket.id);

        // Set up token expiration timer
        if (tokenExpirationTimer) {
          clearTimeout(tokenExpirationTimer);
        }

        // Set timer to notify client before token expires (5 minutes before)
        const warningTime = Math.max(tokenStatus.expiresIn - 5 * 60 * 1000, 0);
        tokenExpirationTimer = setTimeout(() => {
          socket.emit("tokenExpiring", {
            message: "Your session will expire soon. Please refresh your token.",
            expiresIn: 5 * 60 * 1000, // 5 minutes in milliseconds
          });
        }, warningTime);

        // Notify others about new user
        socket.broadcast.emit("userJoined", {
          user: connectedUsers.get(socket.id),
          usersCount: connectedUsers.size,
          message: `${user.name} joined the chat`,
        });

        // Send current users list to the new user
        socket.emit("usersList", Array.from(connectedUsers.values()));

        const recentMessages = await Message.find().sort({ timestamp: -1 }).limit(50).lean();
        socket.emit("messageHistory", recentMessages.reverse());
      } catch (error) {
        console.error("User join error:", error);
        socket.emit("error", {
          success: false,
          message: "Authentication failed",
          error: error.message,
        });
      }
    });

    // Handle token refresh
    socket.on("refreshToken", async newToken => {
      try {
        const tokenStatus = await checkTokenExpiration(newToken);
        if (!tokenStatus.isValid) {
          throw new Error(tokenStatus.error);
        }

        const user = await authenticateSocket(newToken);

        // Update user data
        const currentUser = connectedUsers.get(socket.id);
        if (currentUser) {
          connectedUsers.set(socket.id, {
            ...currentUser,
            uid: user.uid,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        }

        // Update user ID to socket ID mapping
        userSocketMap.set(user.uid, socket.id);

        // Reset token expiration timer
        if (tokenExpirationTimer) {
          clearTimeout(tokenExpirationTimer);
        }

        // Set new timer
        const warningTime = Math.max(tokenStatus.expiresIn - 5 * 60 * 1000, 0);
        tokenExpirationTimer = setTimeout(() => {
          socket.emit("tokenExpiring", {
            message: "Your session will expire soon. Please refresh your token.",
            expiresIn: 5 * 60 * 1000,
          });
        }, warningTime);

        socket.emit("tokenRefreshed", {
          success: true,
          message: "Token refreshed successfully",
        });
      } catch (error) {
        console.error("Token refresh error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to refresh token",
          error: error.message,
        });
      }
    });

    // Handle private messages
    socket.on("privateMessage", async messageData => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) {
          throw new Error("User not authenticated");
        }

        if (!messageData.receiverId) {
          throw new Error("Receiver ID is required");
        }

        // Get receiver details
        const receiver = await User.findOne({
          $or: [
            { firebaseUid: messageData.receiverId },
            // _id কে ObjectId-তে রূপান্তর করার চেষ্টা করুন, যদি এটি একটি বৈধ ObjectId হয়
            ...(mongoose.Types.ObjectId.isValid(messageData.receiverId)
              ? [{ _id: mongoose.Types.ObjectId(messageData.receiverId) }]
              : []),
          ],
        });

        if (!receiver) {
          throw new Error("Receiver not found");
        }

        // Create and save private message
        const newPrivateMessage = new PrivateMessage({
          senderId: user.uid,
          senderName: user.name,
          senderEmail: user.email,
          receiverId: receiver.firebaseUid || receiver._id,
          receiverName: receiver.name,
          text: messageData.text,
          type: messageData.type || "text",
          delivered: false,
          read: false,
        });

        const savedMessage = await newPrivateMessage.save();

        const message = {
          id: savedMessage._id,
          text: savedMessage.text,
          type: savedMessage.type,
          sender: {
            id: socket.id,
            uid: user.uid,
            name: user.name,
            email: user.email,
          },
          receiver: {
            uid: receiver.firebaseUid || receiver._id,
            name: receiver.name,
            email: receiver.email,
          },
          timestamp: savedMessage.timestamp,
          status: savedMessage.status,
          read: savedMessage.read,
          delivered: savedMessage.delivered,
        };

        const receiverSocketId = getSocketIdByUserId(receiver.firebaseUid || receiver._id);

        if (receiverSocketId) {
          // Send to receiver
          io.to(receiverSocketId).emit("privateMessage", message);

          // Update message status to delivered
          savedMessage.delivered = true;
          savedMessage.deliveredAt = new Date();
          await savedMessage.save();

          // Send delivery confirmation to sender
          socket.emit("messageDelivered", {
            messageId: savedMessage._id,
            receiverId: receiver.firebaseUid || receiver._id,
            status: "delivered",
          });

          // Send back to sender
          socket.emit("privateMessage", message);
        } else {
          socket.emit("error", {
            success: false,
            message: "User is offline",
            error: "The recipient is not currently online",
          });
        }

        // Send updated message history
        await sendUpdatedPrivateHistory(io, socket, user.uid, receiver.firebaseUid || receiver._id);
      } catch (error) {
        console.error("Private message error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to send private message",
          error: error.message,
        });
      }
    });

    // Room message handling
    socket.on("roomMessage", messageData => {
      handleRoomMessage(io, socket, messageData);
    });

    // Public chat handling
    socket.on("publicMessage", messageData => {
      handlePublicMessage(io, socket, messageData);
    });

    // Request public message history
    socket.on("requestPublicHistory", async () => {
      try {
        const messageHistory = await Message.find({
          messageType: "public",
        })
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();

        socket.emit("publicMessageHistory", messageHistory.reverse());
      } catch (error) {
        console.error("Error fetching public message history:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to fetch message history",
          error: error.message,
        });
      }
    });

    // Request private message history with specific user
    socket.on("requestPrivateHistory", async data => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) {
          throw new Error("User not authenticated");
        }

        await sendUpdatedPrivateHistory(io, socket, user.uid, data.userId);
      } catch (error) {
        console.error("Error fetching private message history:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to fetch private message history",
          error: error.message,
        });
      }
    });

    // Request room message history
    socket.on("requestRoomHistory", async roomId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        // Check if user is member of the group
        const group = await Group.findById(roomId);
        if (!group || !group.isMember(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "You are not a member of this group",
          });
          return;
        }

        const messageHistory = await Message.find({
          roomId: roomId,
          messageType: "room",
        })
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();

        socket.emit("roomMessageHistory", messageHistory.reverse());
      } catch (error) {
        console.error("Request room history error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to get room message history",
          error: error.message,
        });
      }
    });

    // Join room (for groups)
    socket.on("joinRoom", async roomData => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const group = await Group.findById(roomData.roomId);
        if (!group) {
          socket.emit("error", {
            success: false,
            message: "Group not found",
          });
          return;
        }

        if (!group.isMember(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "You are not a member of this group",
          });
          return;
        }

        joinRoom(socket, roomData.roomId);
        socket.emit("roomJoined", {
          roomId: roomData.roomId,
          roomName: group.name,
        });

        // Notify other room members
        socket.to(roomData.roomId).emit("userJoinedRoom", {
          roomId: roomData.roomId,
          user: {
            uid: user.uid,
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        console.error("Join room error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to join room",
          error: error.message,
        });
      }
    });

    // Leave room
    socket.on("leaveRoom", async roomId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        leaveRoom(socket, roomId);
        socket.emit("roomLeft", {
          roomId: roomId,
        });

        // Notify other room members
        socket.to(roomId).emit("userLeftRoom", {
          roomId: roomId,
          user: {
            uid: user.uid,
            name: user.name,
          },
        });
      } catch (error) {
        console.error("Leave room error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to leave room",
          error: error.message,
        });
      }
    });

    // Typing indicators
    socket.on("typing", data => {
      const user = getUserDetails(socket.id);
      if (!user) return;

      const typingData = {
        userId: socket.id,
        userName: user.name,
        isTyping: data.isTyping,
        type: data.type || "public",
        receiverId: data.receiverId,
        roomId: data.roomId,
      };

      if (data.type === "private" && data.receiverId) {
        const receiverSocket = getSocketIdByUserId(data.receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("userTyping", typingData);
        }
      } else if (data.type === "room" && data.roomId) {
        io.to(data.roomId).emit("userTyping", typingData);
      } else {
        socket.broadcast.emit("userTyping", typingData);
      }
    });

    // Message read status
    socket.on("markMessageAsRead", async messageId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const message = await Message.findById(messageId);
        if (message) {
          if (!message.readBy.some(read => read.userId === user.uid)) {
            message.readBy.push({
              userId: user.uid,
              readAt: new Date(),
            });
            await message.save();

            const senderSocket = getSocketIdByUserId(message.senderId);
            if (senderSocket) {
              io.to(senderSocket).emit("messageRead", {
                messageId,
                readBy: user.uid,
              });
            }
          }
        }
      } catch (error) {
        console.error("Mark message as read error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to mark message as read",
          error: error.message,
        });
      }
    });

    // Mark all messages from a user as read
    socket.on("markAllMessagesAsRead", async data => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const messages = await Message.find({
          senderId: data.userId,
          receiverId: user.uid,
          messageType: "private",
          "readBy.userId": { $ne: user.uid },
        });

        const updatePromises = messages.map(message => {
          message.readBy.push({
            userId: user.uid,
            readAt: new Date(),
          });
          return message.save();
        });

        await Promise.all(updatePromises);

        const senderSocket = getSocketIdByUserId(data.userId);
        if (senderSocket) {
          io.to(senderSocket).emit("allMessagesRead", {
            readerId: user.uid,
          });
        }

        socket.emit("allMessagesRead", {
          success: true,
          count: messages.length,
        });
      } catch (error) {
        console.error("Mark all messages as read error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to mark all messages as read",
          error: error.message,
        });
      }
    });

    // Get unread message count
    socket.on("getUnreadCount", async () => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const unreadCounts = await Message.aggregate([
          {
            $match: {
              receiverId: user.uid,
              messageType: "private",
              "readBy.userId": { $ne: user.uid },
            },
          },
          {
            $group: {
              _id: "$senderId",
              count: { $sum: 1 },
            },
          },
        ]);

        const formattedCounts = unreadCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});

        socket.emit("unreadCounts", formattedCounts);
      } catch (error) {
        console.error("Get unread count error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to get unread message count",
          error: error.message,
        });
      }
    });

    // Mark private message as read
    socket.on("markPrivateMessageAsRead", async messageId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const message = await PrivateMessage.findById(messageId);
        if (message && message.receiverId === user.uid) {
          message.read = true;
          message.readAt = new Date();
          await message.save();

          const senderSocket = getSocketIdByUserId(message.senderId);
          if (senderSocket) {
            io.to(senderSocket).emit("messageRead", {
              messageId,
              readBy: user.uid,
            });
          }
        }
      } catch (error) {
        console.error("Mark message as read error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to mark message as read",
          error: error.message,
        });
      }
    });

    // Edit private message
    socket.on("editPrivateMessage", async data => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const message = await PrivateMessage.findById(data.messageId);
        if (message && message.senderId === user.uid) {
          message.text = data.newText;
          message.edited = true;
          message.editedAt = new Date();
          await message.save();

          const receiverSocket = getSocketIdByUserId(message.receiverId);
          if (receiverSocket) {
            io.to(receiverSocket).emit("messageEdited", {
              messageId: message._id,
              newText: message.text,
              editedAt: message.editedAt,
            });
          }
        }
      } catch (error) {
        console.error("Edit message error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to edit message",
          error: error.message,
        });
      }
    });

    // Delete private message
    socket.on("deletePrivateMessage", async messageId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const message = await PrivateMessage.findById(messageId);
        if (message && (message.senderId === user.uid || message.receiverId === user.uid)) {
          message.deleted = true;
          message.deletedAt = new Date();
          await message.save();

          const otherUserId = message.senderId === user.uid ? message.receiverId : message.senderId;
          const otherUserSocket = getSocketIdByUserId(otherUserId);
          if (otherUserSocket) {
            io.to(otherUserSocket).emit("messageDeleted", {
              messageId: message._id,
            });
          }
        }
      } catch (error) {
        console.error("Delete message error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to delete message",
          error: error.message,
        });
      }
    });

    // Group Management Events

    // Get all groups
    socket.on("getGroups", async () => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const groups = await Group.find({ isActive: true })
          .select("name description members createdBy creatorName createdAt")
          .lean();

        socket.emit("groupsList", groups);
      } catch (error) {
        console.error("Get groups error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to get groups",
          error: error.message,
        });
      }
    });

    // Create group
    socket.on("createGroup", async groupData => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        // Check if user is admin
        if (user.role !== "admin") {
          socket.emit("error", {
            success: false,
            message: "Only admins can create groups",
          });
          return;
        }

        // Create new group
        const newGroup = new Group({
          name: groupData.name,
          description: groupData.description,
          createdBy: user.uid,
          creatorName: user.name,
          members: [
            {
              id: user.uid,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          ],
        });

        // Add selected members if provided
        if (groupData.members && Array.isArray(groupData.members)) {
          for (const memberId of groupData.members) {
            const memberUser = await User.findOne({
              $or: [{ firebaseUid: memberId }, { _id: memberId }],
            });
            if (memberUser) {
              newGroup.addMember({
                id: memberUser.firebaseUid || memberUser._id,
                name: memberUser.name,
                email: memberUser.email,
                role: memberUser.role,
              });
            }
          }
        }

        const savedGroup = await newGroup.save();
        console.log("Group created:", savedGroup);

        // Broadcast to all connected users
        io.emit("groupCreated", {
          id: savedGroup._id,
          name: savedGroup.name,
          description: savedGroup.description,
          createdBy: savedGroup.createdBy,
          creatorName: savedGroup.creatorName,
          members: savedGroup.members,
          createdAt: savedGroup.createdAt,
        });

        socket.emit("groupCreated", {
          success: true,
          message: `Group "${savedGroup.name}" created successfully`,
        });
      } catch (error) {
        console.error("Create group error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to create group",
          error: error.message,
        });
      }
    });

    // Join group
    socket.on("joinGroup", async groupId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const group = await Group.findById(groupId);
        if (!group) {
          socket.emit("error", {
            success: false,
            message: "Group not found",
          });
          return;
        }

        if (!group.isActive) {
          socket.emit("error", {
            success: false,
            message: "Group is not active",
          });
          return;
        }

        if (group.isMember(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "Already a member of this group",
          });
          return;
        }

        if (group.members.length >= group.maxMembers) {
          socket.emit("error", {
            success: false,
            message: "Group is full",
          });
          return;
        }

        // Add user to group
        group.addMember({
          id: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
        });

        await group.save();

        // Join socket room
        socket.join(groupId);

        // Notify group members
        io.to(groupId).emit("userJoinedRoom", {
          groupId,
          user: {
            uid: user.uid,
            name: user.name,
            email: user.email,
          },
        });

        // Notify the user who joined
        socket.emit("groupJoined", {
          groupId,
          groupName: group.name,
          user: {
            uid: user.uid,
            name: user.name,
          },
        });

        console.log(`User ${user.name} joined group ${group.name}`);
      } catch (error) {
        console.error("Join group error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to join group",
          error: error.message,
        });
      }
    });

    // Leave group
    socket.on("leaveGroup", async groupId => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const group = await Group.findById(groupId);
        if (!group) {
          socket.emit("error", {
            success: false,
            message: "Group not found",
          });
          return;
        }

        if (!group.isMember(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "Not a member of this group",
          });
          return;
        }

        // Remove user from group
        group.removeMember(user.uid);
        await group.save();

        // Leave socket room
        socket.leave(groupId);

        // Notify group members
        io.to(groupId).emit("userLeftRoom", {
          groupId,
          user: {
            uid: user.uid,
            name: user.name,
          },
        });

        // Notify the user who left
        socket.emit("groupLeft", {
          groupId,
          groupName: group.name,
          userId: user.uid,
        });

        console.log(`User ${user.name} left group ${group.name}`);
      } catch (error) {
        console.error("Leave group error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to leave group",
          error: error.message,
        });
      }
    });

    // Add user to group (admin only)
    socket.on("addUserToGroup", async data => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const group = await Group.findById(data.groupId);
        if (!group) {
          socket.emit("error", {
            success: false,
            message: "Group not found",
          });
          return;
        }

        // Check if user is admin of the group
        if (!group.isAdmin(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "Only group admins can add members",
          });
          return;
        }

        const memberUser = await User.findOne({
          $or: [{ firebaseUid: data.userId }, { _id: data.userId }],
        });

        if (!memberUser) {
          socket.emit("error", {
            success: false,
            message: "User not found",
          });
          return;
        }

        if (group.isMember(memberUser.firebaseUid || memberUser._id)) {
          socket.emit("error", {
            success: false,
            message: "User is already a member",
          });
          return;
        }

        // Add user to group
        group.addMember({
          id: memberUser.firebaseUid || memberUser._id,
          name: memberUser.name,
          email: memberUser.email,
          role: memberUser.role,
        });

        await group.save();

        // Notify group members
        io.to(data.groupId).emit("userAddedToGroup", {
          groupId: data.groupId,
          groupName: group.name,
          user: {
            uid: memberUser.firebaseUid || memberUser._id,
            name: memberUser.name,
            email: memberUser.email,
          },
        });

        console.log(`User ${memberUser.name} added to group ${group.name}`);
      } catch (error) {
        console.error("Add user to group error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to add user to group",
          error: error.message,
        });
      }
    });

    // Remove user from group (admin only)
    socket.on("removeUserFromGroup", async data => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const group = await Group.findById(data.groupId);
        if (!group) {
          socket.emit("error", {
            success: false,
            message: "Group not found",
          });
          return;
        }

        // Check if user is admin of the group
        if (!group.isAdmin(user.uid)) {
          socket.emit("error", {
            success: false,
            message: "Only group admins can remove members",
          });
          return;
        }

        const memberUser = await User.findOne({
          $or: [{ firebaseUid: data.userId }, { _id: data.userId }],
        });

        if (!memberUser) {
          socket.emit("error", {
            success: false,
            message: "User not found",
          });
          return;
        }

        if (!group.isMember(memberUser.firebaseUid || memberUser._id)) {
          socket.emit("error", {
            success: false,
            message: "User is not a member of this group",
          });
          return;
        }

        // Remove user from group
        group.removeMember(memberUser.firebaseUid || memberUser._id);
        await group.save();

        // Notify group members
        io.to(data.groupId).emit("userRemovedFromGroup", {
          groupId: data.groupId,
          groupName: group.name,
          userId: memberUser.firebaseUid || memberUser._id,
          userName: memberUser.name,
        });

        console.log(`User ${memberUser.name} removed from group ${group.name}`);
      } catch (error) {
        console.error("Remove user from group error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to remove user from group",
          error: error.message,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      if (tokenExpirationTimer) {
        clearTimeout(tokenExpirationTimer);
      }
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log("Client disconnected:", socket.id);
        connectedUsers.delete(socket.id);
        userSocketMap.delete(user.uid);

        if (user.role === "guest") {
          await GuestUser.findOneAndUpdate({ socketId: socket.id }, { lastActive: new Date() });
        }

        // Leave all rooms
        for (const [roomId, participants] of roomParticipants.entries()) {
          if (participants.has(user.uid)) {
            leaveRoom(socket, roomId);
            io.to(roomId).emit("userLeftRoom", {
              roomId,
              user: {
                uid: user.uid,
                name: user.name,
              },
            });
          }
        }

        socket.broadcast.emit("userLeft", {
          user: user,
          usersCount: connectedUsers.size,
          message: `${user.name} left the chat`,
        });
      }
    });
  });
};

// Remove the standalone socket event listeners and functions
module.exports = initializeSocketIo;
