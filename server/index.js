const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { verifyToken, isAdmin } = require("./middleware/auth");
const admin = require("firebase-admin");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/auth"));

// Store connected users with their details
const connectedUsers = new Map();

// Socket.io connection handling
io.on("connection", socket => {
  console.log("New client connected:", socket.id);

  // Handle user joining with Firebase token
  socket.on("userJoin", async (userData) => {
    try {
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(userData.token);
      
      // Store user data
    connectedUsers.set(socket.id, {
      id: socket.id,
        uid: decodedToken.uid,
        name: decodedToken.name || "Anonymous",
        email: decodedToken.email,
      avatar: userData.avatar || null,
      joinedAt: new Date(),
    });

    // Notify others about new user
    socket.broadcast.emit("userJoined", {
      user: connectedUsers.get(socket.id),
      usersCount: connectedUsers.size,
        message: `${decodedToken.name || "Anonymous"} joined the chat`,
    });

    // Send current users list to the new user
    socket.emit("usersList", Array.from(connectedUsers.values()));
    } catch (error) {
      console.error("Token verification failed:", error);
      socket.emit("error", { 
        success: false,
        message: "Authentication failed",
        error: error.message 
      });
    }
  });

  // Handle chat messages
  socket.on("sendMessage", messageData => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now(),
      text: messageData.text,
      sender: {
        id: socket.id,
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
      },
      timestamp: new Date(),
    };

    // Broadcast message to all users
    io.emit("message", message);
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
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
    console.log("Client disconnected:", socket.id);
    connectedUsers.delete(socket.id);

    socket.broadcast.emit("userLeft", {
      user: user,
      usersCount: connectedUsers.size,
        message: `${user.name || "Someone"} left the chat`,
    });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
