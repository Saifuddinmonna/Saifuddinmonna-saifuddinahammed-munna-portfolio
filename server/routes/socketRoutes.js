const admin = require("firebase-admin");
const User = require("../models/User");
const Message = require("../models/Message");
const GuestUser = require("../models/GuestUser");

// Store connected users with their details
const connectedUsers = new Map();

const initializeSocketIo = (io) => {
  // Socket.io connection handling
  io.on("connection", socket => {
    console.log("New client connected:", socket.id);

    // Handle user joining with Firebase token
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
          // Verify Firebase token for registered users
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
          }
        } else if (userData.guestName) {
          // Handle guest user
          const guestUser = new GuestUser({
            socketId: socket.id,
            name: userData.guestName,
            phone: userData.phone || null,
          });
          await guestUser.save();
          
          userDetails = {
            id: socket.id,
            uid: guestUser._id,
            name: guestUser.name,
            avatar: null,
            joinedAt: new Date(),
          };
        }

        // Store user data
        connectedUsers.set(socket.id, {
          ...userDetails,
          role: userRole
        });

        // Notify others about new user
        socket.broadcast.emit("userJoined", {
          user: connectedUsers.get(socket.id),
          usersCount: connectedUsers.size,
          message: `${userDetails.name} joined the chat`,
        });

        // Send current users list to the new user
        socket.emit("usersList", Array.from(connectedUsers.values()));

        // Send recent messages
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

    // Handle chat messages
    socket.on("sendMessage", async (messageData) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        // Create and save message
        const newMessage = new Message({
          senderId: user.uid,
          senderName: user.name,
          senderEmail: user.email,
          senderRole: user.role,
          message: messageData.text,
          receiverId: messageData.receiverId,
          roomId: messageData.roomId,
        });
        await newMessage.save();

        const message = {
          id: newMessage._id,
          text: messageData.text,
          sender: {
            id: socket.id,
            uid: user.uid,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
          timestamp: newMessage.timestamp,
        };

        // Handle message routing
        if (messageData.receiverId) {
          // Private message
          const receiverSocket = Array.from(connectedUsers.entries())
            .find(([_, u]) => u.uid === messageData.receiverId)?.[0];
          if (receiverSocket) {
            io.to(receiverSocket).emit("message", message);
            socket.emit("message", message);
          }
        } else if (messageData.roomId) {
          // Room message
          io.to(messageData.roomId).emit("message", message);
        } else {
          // Public message
          io.emit("message", message);
        }
      } catch (error) {
        console.error("Message sending error:", error);
        socket.emit("error", {
          success: false,
          message: "Failed to send message",
          error: error.message
        });
      }
    });

    // Handle typing status
    socket.on("typing", isTyping => {
      const user = connectedUsers.get(socket.id);
      socket.broadcast.emit("userTyping", {
        userId: socket.id,
        userName: user?.name || "Anonymous",
        isTyping,
      });
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log("Client disconnected:", socket.id);
        connectedUsers.delete(socket.id);

        // Update guest user's last active time if applicable
        if (user.role === 'guest') {
          await GuestUser.findOneAndUpdate(
            { socketId: socket.id },
            { lastActive: new Date() }
          );
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

module.exports = initializeSocketIo; 