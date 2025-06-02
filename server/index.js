const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userController = require("./controllers/userController");
const User = require("./models/User");
const Message = require("./models/Message");

// Error handling for uncaught exceptions
process.on("uncaughtException", error => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", error => {
  console.error("Unhandled Rejection:", error);
});

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Socket.io setup with error handling
let io;
try {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  });
} catch (error) {
  console.error("Socket.io initialization error:", error);
  process.exit(1);
}

// Basic middleware
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  const connect = async () => {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_saifuddin",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          family: 4,
        }
      );
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      retryCount++;

      if (retryCount < maxRetries) {
        console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
        setTimeout(connect, 5000);
      } else {
        console.error("Max retries reached. Could not connect to MongoDB");
        process.exit(1);
      }
    }
  };

  await connect();
};

connectDB();

// Routes
app.use("/api", require("./routes/testimonialRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Store connected users with their details
const connectedUsers = new Map();

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const user = socket.handshake.auth.user;

  if (!user) {
    return next(new Error("Authentication error: No user data provided"));
  }

  // If token exists, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { ...user, isAuthenticated: true };
    } catch (error) {
      console.error("Token verification failed:", error);
      // Fall back to guest user
      socket.user = { ...user, isGuest: true };
    }
  } else {
    // No token, treat as guest
    socket.user = { ...user, isGuest: true };
  }

  next();
});

// Socket.io connection handling
io.on("connection", socket => {
  console.log("User connected:", socket.user);

  // Store user in connected users
  connectedUsers.set(socket.id, socket.user);

  // Join default room
  socket.join("general");

  // Handle authentication
  socket.on("authenticate", data => {
    const { token, user } = data;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { ...user, isAuthenticated: true };
        socket.emit("auth_success");
      } catch (error) {
        console.error("Token verification failed:", error);
        socket.emit("auth_error", { message: "Invalid token" });
      }
    } else {
      // Guest user
      socket.user = { ...user, isGuest: true };
      socket.emit("auth_success");
    }

    // Update connected users
    connectedUsers.set(socket.id, socket.user);

    // Broadcast updated user list
    io.emit("userList", Array.from(connectedUsers.values()));
  });

  // Handle room joining
  socket.on("joinRoom", roomId => {
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }
    socket.join(roomId);
    socket.currentRoom = roomId;
    socket.emit("roomJoined", roomId);
  });

  // Handle messages
  socket.on("message", async message => {
    try {
      if (!socket.user) {
        throw new Error("User not authenticated");
      }

      const newMessage = new Message({
        content: message.content,
        sender: {
          id: socket.user.id,
          name: socket.user.name,
          email: socket.user.email,
          photoURL: socket.user.photoURL,
          isGuest: socket.user.isGuest,
        },
        room: message.roomId || "general",
      });

      await newMessage.save();
      io.to(message.roomId || "general").emit("message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  // Handle typing status
  socket.on("typing", ({ isTyping }) => {
    if (!socket.user) return;

    if (isTyping) {
      socket.to(socket.currentRoom || "general").emit("userTyping", socket.user.name);
    } else {
      socket.to(socket.currentRoom || "general").emit("userStoppedTyping", socket.user.name);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user);
    connectedUsers.delete(socket.id);
    io.emit("userList", Array.from(connectedUsers.values()));
  });
});

// Server startup with error handling
const PORT = process.env.PORT || 5000;
try {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup error:", error);
  process.exit(1);
}
