import io from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true, // Crucial for sending cookies/auth tokens
  transports: ["websocket"], // Prefer WebSocket
  autoConnect: false, // We'll manually connect when needed
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", error => {
  console.error("Socket.IO connection error:", error.message);
});
