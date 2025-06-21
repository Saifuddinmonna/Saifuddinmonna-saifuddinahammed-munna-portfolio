const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { verifyToken, isAdmin } = require("./auth");
const admin = require("firebase-admin");
const User = require("./User");
const Message = require("./Message");
const GuestUser = require("./GuestUser");
require("dotenv").config();
const serverless = require("serverless-http");
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ""),
  "http://localhost:3000",
  "http://localhost:3000/",
  "https://portfolio-saifuddin-server.vercel.app",
].filter(Boolean); // This removes any undefined values

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public")); // Serve files from public folder

// Fix double slashes in URLs
app.use((req, res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/\/+/g, "/");
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_saifuddin";
console.log("MongoDB URI (masked):", mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"));

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/testimonials", require("./testimonialRoutes"));
app.use("/api/users", require("./userRoutes"));
app.use("/api/auth", require("./auth"));
app.use("/api/blogs", require("./blogRoutes"));
app.use("/api/private-messages", require("./routes/privateMessages"));

// Store connected users with their details
const connectedUsers = new Map();

// Initialize Socket.IO
const initializeSocketIo = require("./socketRoutes");
initializeSocketIo(io);

// Socket.io connection handling
io.on("connection", socket => {
  console.log("New client connected:", socket.id);

  // Handle user joining with Firebase token
  socket.on("userJoin", async userData => {
    try {
      let userRole = "guest";
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
        role: userRole,
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

  // Handle chat messages
  socket.on("sendMessage", async messageData => {
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
        const receiverSocket = Array.from(connectedUsers.entries()).find(
          ([_, u]) => u.uid === messageData.receiverId
        )?.[0];
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
        error: error.message,
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
      if (user.role === "guest") {
        await GuestUser.findOneAndUpdate({ socketId: socket.id }, { lastActive: new Date() });
      }

      socket.broadcast.emit("userLeft", {
        user: user,
        usersCount: connectedUsers.size,
        message: `${user.name} left the chat`,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
