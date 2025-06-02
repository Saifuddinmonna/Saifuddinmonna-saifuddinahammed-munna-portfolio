import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const createSocket = (token = null) => {
  return io(SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    autoConnect: true,
  });
};

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = createSocket(localStorage.getItem("token"));

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("Socket connected");
        toast.success("Connected to chat server");
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
        toast.error("Disconnected from chat server");
      });

      this.socket.on("error", error => {
        console.error("Socket error:", error);
        toast.error(error.message || "Socket connection error");
      });

      // Message event handlers
      this.socket.on("message", message => {
        this.notifyListeners("message", message);
      });

      this.socket.on("typing", data => {
        this.notifyListeners("typing", data);
      });

      this.socket.on("userJoined", user => {
        this.notifyListeners("userJoined", user);
        toast.info(`${user.name} joined the chat`);
      });

      this.socket.on("userLeft", user => {
        this.notifyListeners("userLeft", user);
        toast.info(`${user.name} left the chat`);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event subscription methods
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Chat methods
  sendMessage(message) {
    if (this.socket) {
      this.socket.emit("message", message);
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit("joinRoom", roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit("leaveRoom", roomId);
    }
  }

  startTyping(roomId) {
    if (this.socket) {
      this.socket.emit("typing", { roomId, isTyping: true });
    }
  }

  stopTyping(roomId) {
    if (this.socket) {
      this.socket.emit("typing", { roomId, isTyping: false });
    }
  }

  // Admin methods
  broadcastMessage(message) {
    if (this.socket) {
      this.socket.emit("broadcast", message);
    }
  }

  getSystemStats() {
    if (this.socket) {
      this.socket.emit("getStats");
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
