import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import LiveChat from "../components/Chat/LiveChat";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    let socketInstance = null;

    const initializeSocket = () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }

      const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

      socketInstance = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: false,
        transports: ["websocket", "polling"],
      });

      // Connection event handlers
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);

        // If user is authenticated, emit auth event
        if (isAuthenticated && user) {
          socketInstance.emit("authenticate", {
            token: localStorage.getItem("token"),
            user: {
              id: user.uid,
              name: user.displayName || "Guest",
              email: user.email,
              photoURL: user.photoURL,
            },
          });
        } else {
          // If not authenticated, connect as guest
          socketInstance.emit("authenticate", {
            user: {
              id: `guest_${Date.now()}`,
              name: "Guest",
              isGuest: true,
            },
          });
        }
      });

      socketInstance.on("connect_error", error => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
        setIsConnecting(false);

        if (reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts(prev => prev + 1);
          setTimeout(() => {
            initializeSocket();
          }, 2000);
        } else {
          toast.error("Failed to connect to chat server. Please refresh the page.");
        }
      });

      socketInstance.on("disconnect", reason => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);

        if (reason === "io server disconnect") {
          // Server initiated disconnect, try to reconnect
          socketInstance.connect();
        }
      });

      socketInstance.on("auth_error", error => {
        console.error("Authentication error:", error);
        toast.error("Authentication failed. Please try again.");
        setIsConnected(false);
      });

      socketInstance.on("auth_success", () => {
        console.log("Authentication successful");
        setIsConnected(true);
      });

      socketInstance.on("message", message => {
        setMessages(prev => [...prev, message]);
      });

      socketInstance.on("userTyping", ({ userId, name, isTyping }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(name);
          } else {
            newSet.delete(name);
          }
          return newSet;
        });
      });

      socketInstance.on("userJoined", ({ user, message }) => {
        toast.info(message);
        setOnlineUsers(prev => [...prev, user]);
      });

      socketInstance.on("userLeft", ({ user, message }) => {
        toast.info(message);
        setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
      });

      socketInstance.on("usersList", users => {
        setOnlineUsers(users);
      });

      socketInstance.on("error", error => {
        toast.error(error.message);
      });

      setSocket(socketInstance);
    };

    // Initialize socket connection
    if (!socket && !isConnecting) {
      setIsConnecting(true);
      initializeSocket();
    }

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user, isAuthenticated]);

  // Reconnect when user authentication state changes
  useEffect(() => {
    if (socket && isAuthenticated && user) {
      socket.emit("authenticate", {
        token: localStorage.getItem("token"),
        user: {
          id: user.uid,
          name: user.displayName || "Guest",
          email: user.email,
          photoURL: user.photoURL,
        },
      });
    }
  }, [isAuthenticated, user, socket]);

  const sendMessage = text => {
    if (!socket || !isConnected) {
      toast.error("Not connected to chat server");
      return;
    }

    socket.emit("sendMessage", { text }, response => {
      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  const setTyping = isTyping => {
    if (socket && isConnected) {
      socket.emit("typing", { isTyping });
    }
  };

  const value = {
    socket,
    isConnected,
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    setTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketContext;
