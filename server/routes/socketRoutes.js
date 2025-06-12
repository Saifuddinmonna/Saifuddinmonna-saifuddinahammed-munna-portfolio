const admin = require("firebase-admin");
const User = require("../models/User");
const Message = require("../models/Message");
const GuestUser = require("../models/GuestUser");

// Store connected users with their details
const connectedUsers = new Map();
// Store active groups
const activeGroups = new Map();
// Store user ID to socket ID mapping
const userSocketMap = new Map();
// Store room participants
const roomParticipants = new Map();

// Utility functions
const getUserDetails = (socketId) => {
  return connectedUsers.get(socketId);
};

const getSocketIdByUserId = (userId) => {
  return userSocketMap.get(userId);
};

const isUserOnline = (userId) => {
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

// Message handlers
const handlePrivateMessage = async (io, socket, messageData) => {
  try {
    console.log("Received private message:", messageData);
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
      messageType: 'private',
      receiverId: messageData.receiverId,
      readBy: [{
        userId: user.uid,
        readAt: new Date()
      }]
    });

    const savedMessage = await newMessage.save();
    console.log("Private message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.message,
      type: 'private',
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      receiverId: savedMessage.receiverId,
      timestamp: savedMessage.timestamp,
      readBy: savedMessage.readBy
    };

    const receiverSocketId = getSocketIdByUserId(messageData.receiverId);
    console.log("Receiver socket ID:", receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("privateMessage", message);
      console.log("Message sent to receiver:", receiverSocketId);
      socket.emit("privateMessage", message);
      console.log("Message sent back to sender:", socket.id);
    } else {
      console.log("Receiver is offline:", messageData.receiverId);
      socket.emit("error", {
        success: false,
        message: "User is offline",
        error: "The recipient is not currently online"
      });
    }

    // Send message history
    const messageHistory = await Message.find({
      $or: [
        { senderId: user.uid, receiverId: messageData.receiverId },
        { senderId: messageData.receiverId, receiverId: user.uid }
      ],
      messageType: 'private'
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .lean();

    socket.emit("privateMessageHistory", messageHistory.reverse());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("privateMessageHistory", messageHistory.reverse());
    }
  } catch (error) {
    console.error("Private message error:", error);
    socket.emit("error", {
      success: false,
      message: "Failed to send private message",
      error: error.message
    });
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

    const newMessage = new Message({
      senderId: user.uid,
      senderName: user.name,
      senderEmail: user.email,
      senderRole: user.role,
      message: messageData.text,
      messageType: 'room',
      roomId: messageData.roomId,
      roomName: messageData.roomName,
      readBy: [{
        userId: user.uid,
        readAt: new Date()
      }]
    });

    const savedMessage = await newMessage.save();
    console.log("Room message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.message,
      type: 'room',
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
      readBy: savedMessage.readBy
    };

    // Send to all room participants
    io.to(messageData.roomId).emit("roomMessage", message);
    console.log("Message sent to room:", messageData.roomId);

    // Send room message history
    const messageHistory = await Message.find({
      roomId: messageData.roomId,
      messageType: 'room'
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
      error: error.message
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
      messageType: 'public',
      readBy: [{
        userId: user.uid,
        readAt: new Date()
      }]
    });

    const savedMessage = await newMessage.save();
    console.log("Public message saved to database:", savedMessage);

    const message = {
      id: savedMessage._id,
      text: savedMessage.message,
      type: 'public',
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      timestamp: savedMessage.timestamp,
      readBy: savedMessage.readBy
    };

    // Broadcast to all connected users
    io.emit("publicMessage", message);
    console.log("Public message broadcasted to all users");

    // Send updated message history to all users
    const messageHistory = await Message.find({
      messageType: 'public'
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
      error: error.message
    });
  }
};

const initializeSocketIo = (io) => {
  io.on("connection", socket => {
    console.log("New client connected:", socket.id);

    // Handle user joining
    socket.on("userJoin", async (userData) => {
      try {
        let userRole = 'guest';
        let userDetails = {
          id: socket.id,
          name: "Anonymous",
          email: null,
          avatar: null,
          joinedAt: new Date(),
        };

        if (userData.token) {
          try {
            const decodedToken = await admin.auth().verifyIdToken(userData.token);
            const dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
            
            if (dbUser) {
              userRole = dbUser.role;
              userDetails = {
                id: socket.id,
                uid: decodedToken.uid,
                name: dbUser.name,
                email: dbUser.email,
                avatar: userData.avatar || null,
                joinedAt: new Date(),
              };
              userSocketMap.set(decodedToken.uid, socket.id);
            }
          } catch (tokenError) {
            console.log('Token verification error:', tokenError);
            // If token is expired, emit an event to client to refresh token
            if (tokenError.code === 'auth/id-token-expired') {
              socket.emit('tokenExpired', {
                message: 'Token expired. Please refresh your token.'
              });
              return;
            }
            // For other token errors, continue as guest
            console.log('Continuing as guest due to token error');
          }
        } else if (userData.guestName) {
          try {
            let guestUser = await GuestUser.findOne({ socketId: socket.id });
            
            if (!guestUser) {
              guestUser = new GuestUser({
                socketId: socket.id,
                name: userData.guestName,
                phone: userData.phone || null,
              });
              await guestUser.save();
            } else {
              guestUser.name = userData.guestName;
              guestUser.phone = userData.phone || guestUser.phone;
              guestUser.lastActive = new Date();
              await guestUser.save();
            }
            
            userDetails = {
              id: socket.id,
              uid: guestUser._id,
              name: guestUser.name,
              avatar: null,
              joinedAt: new Date(),
            };
            userSocketMap.set(guestUser._id.toString(), socket.id);
          } catch (guestError) {
            console.error("Guest user handling error:", guestError);
            userDetails = {
              id: socket.id,
              uid: `guest_${socket.id}`,
              name: userData.guestName || "Anonymous Guest",
              avatar: null,
              joinedAt: new Date(),
            };
            userSocketMap.set(userDetails.uid, socket.id);
          }
        }

        connectedUsers.set(socket.id, {
          ...userDetails,
          role: userRole
        });

        socket.broadcast.emit("userJoined", {
          user: connectedUsers.get(socket.id),
          usersCount: connectedUsers.size,
          message: `${userDetails.name} joined the chat`,
        });

        socket.emit("usersList", Array.from(connectedUsers.values()));

        const recentMessages = await Message.find()
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();
        socket.emit("messageHistory", recentMessages.reverse());

      } catch (error) {
        console.error("User join error:", error);
        socket.emit("error", { 
          success: false,
          message: "Authentication failed",
          error: error.message 
        });
      }
    });

    // Add token refresh handler
    socket.on("refreshToken", async (newToken) => {
      try {
        const decodedToken = await admin.auth().verifyIdToken(newToken);
        const dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (dbUser) {
          // Update user details with new token
          const userDetails = {
            id: socket.id,
            uid: decodedToken.uid,
            name: dbUser.name,
            email: dbUser.email,
            avatar: null,
            joinedAt: new Date(),
            role: dbUser.role
          };
          
          connectedUsers.set(socket.id, userDetails);
          userSocketMap.set(decodedToken.uid, socket.id);
          
          socket.emit("tokenRefreshed", {
            success: true,
            message: "Token refreshed successfully"
          });
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        socket.emit("error", {
          success: false,
          message: "Token refresh failed",
          error: error.message
        });
      }
    });

    // Private message handling
    socket.on("privateMessage", (messageData) => {
      handlePrivateMessage(io, socket, messageData);
    });

    // Room message handling
    socket.on("roomMessage", (messageData) => {
      handleRoomMessage(io, socket, messageData);
    });

    // Public chat handling
    socket.on("publicMessage", (messageData) => {
      handlePublicMessage(io, socket, messageData);
    });

    // Request public message history
    socket.on("requestPublicHistory", async () => {
      try {
        const messageHistory = await Message.find({
          messageType: 'public'
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
          error: error.message
        });
      }
    });

    // Request private message history with specific user
    socket.on("requestPrivateHistory", async (data) => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) {
          throw new Error("User not authenticated");
        }

        const messageHistory = await Message.find({
          $or: [
            { senderId: user.uid, receiverId: data.userId },
            { senderId: data.userId, receiverId: user.uid }
          ],
          messageType: 'private'
        })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

        socket.emit("privateMessageHistory", messageHistory.reverse());
      } catch (error) {
        console.error("Error fetching private message history:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to fetch private message history",
          error: error.message
        });
      }
    });

    // Room management
    socket.on("joinRoom", (roomData) => {
      const user = getUserDetails(socket.id);
      if (!user) return;

      joinRoom(socket, roomData.roomId);
      socket.emit("roomJoined", {
        roomId: roomData.roomId,
        roomName: roomData.roomName,
        participants: Array.from(roomParticipants.get(roomData.roomId) || [])
      });

      io.to(roomData.roomId).emit("userJoinedRoom", {
        roomId: roomData.roomId,
        user: {
          uid: user.uid,
          name: user.name,
          avatar: user.avatar
        }
      });
    });

    socket.on("leaveRoom", (roomId) => {
      const user = getUserDetails(socket.id);
      if (!user) return;

      leaveRoom(socket, roomId);
      socket.emit("roomLeft", { roomId });

      io.to(roomId).emit("userLeftRoom", {
        roomId,
        user: {
          uid: user.uid,
          name: user.name
        }
      });
    });

    // Typing indicators
    socket.on("typing", (data) => {
      const user = getUserDetails(socket.id);
      if (!user) return;

      const typingData = {
        userId: socket.id,
        userName: user.name,
        isTyping: data.isTyping,
        type: data.type || 'public',
        receiverId: data.receiverId,
        roomId: data.roomId
      };

      if (data.type === 'private' && data.receiverId) {
        const receiverSocket = getSocketIdByUserId(data.receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("userTyping", typingData);
        }
      } else if (data.type === 'room' && data.roomId) {
        io.to(data.roomId).emit("userTyping", typingData);
      } else {
        socket.broadcast.emit("userTyping", typingData);
      }
    });

    // Message read status
    socket.on("markMessageAsRead", async (messageId) => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const message = await Message.findById(messageId);
        if (message) {
          if (!message.readBy.some(read => read.userId === user.uid)) {
            message.readBy.push({
              userId: user.uid,
              readAt: new Date()
            });
            await message.save();

            const senderSocket = getSocketIdByUserId(message.senderId);
            if (senderSocket) {
              io.to(senderSocket).emit("messageRead", {
                messageId,
                readBy: user.uid
              });
            }
          }
        }
      } catch (error) {
        console.error("Mark message as read error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to mark message as read",
          error: error.message
        });
      }
    });

    // Mark all messages from a user as read
    socket.on("markAllMessagesAsRead", async (data) => {
      try {
        const user = getUserDetails(socket.id);
        if (!user) return;

        const messages = await Message.find({
          senderId: data.userId,
          receiverId: user.uid,
          messageType: 'private',
          'readBy.userId': { $ne: user.uid }
        });

        const updatePromises = messages.map(message => {
          message.readBy.push({
            userId: user.uid,
            readAt: new Date()
          });
          return message.save();
        });

        await Promise.all(updatePromises);

        const senderSocket = getSocketIdByUserId(data.userId);
        if (senderSocket) {
          io.to(senderSocket).emit("allMessagesRead", {
            readerId: user.uid
          });
        }

        socket.emit("allMessagesRead", {
          success: true,
          count: messages.length
        });
      } catch (error) {
        console.error("Mark all messages as read error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to mark all messages as read",
          error: error.message
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
              messageType: 'private',
              'readBy.userId': { $ne: user.uid }
            }
          },
          {
            $group: {
              _id: '$senderId',
              count: { $sum: 1 }
            }
          }
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
          error: error.message
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log("Client disconnected:", socket.id);
        connectedUsers.delete(socket.id);
        userSocketMap.delete(user.uid);

        if (user.role === 'guest') {
          await GuestUser.findOneAndUpdate(
            { socketId: socket.id },
            { lastActive: new Date() }
          );
        }

        // Leave all rooms
        for (const [roomId, participants] of roomParticipants.entries()) {
          if (participants.has(user.uid)) {
            leaveRoom(socket, roomId);
            io.to(roomId).emit("userLeftRoom", {
              roomId,
              user: {
                uid: user.uid,
                name: user.name
              }
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