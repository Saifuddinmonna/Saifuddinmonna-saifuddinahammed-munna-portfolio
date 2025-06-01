const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
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

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", require("./routes/testimonialRoutes"));

// Store connected users with their details
const connectedUsers = new Map();

io.on("connection", socket => {
  console.log("New client connected:", socket.id);

  // Handle user joining
  socket.on("userJoin", userData => {
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: userData.name || "Anonymous",
      avatar: userData.avatar || null,
      joinedAt: new Date(),
    });

    // Notify others about new user
    socket.broadcast.emit("userJoined", {
      user: connectedUsers.get(socket.id),
      usersCount: connectedUsers.size,
      message: `${userData.name || "Anonymous"} joined the chat`,
    });

    // Send current users list to the new user
    socket.emit("usersList", Array.from(connectedUsers.values()));
  });

  // Handle chat messages
  socket.on("sendMessage", messageData => {
    const user = connectedUsers.get(socket.id);
    const message = {
      id: Date.now(),
      text: messageData.text,
      sender: {
        id: socket.id,
        name: user?.name || "Anonymous",
        avatar: user?.avatar || null,
      },
      timestamp: new Date(),
    };

    // Broadcast message to all users
    io.emit("message", message);

    // Store message in database if needed
    // You can add message storage logic here
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
    console.log("Client disconnected:", socket.id);

    connectedUsers.delete(socket.id);

    socket.broadcast.emit("userLeft", {
      user: user,
      usersCount: connectedUsers.size,
      message: `${user?.name || "Someone"} left the chat`,
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
