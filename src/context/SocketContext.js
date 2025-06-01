import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import LiveChat from "../components/Chat/LiveChat";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to your Socket.IO server
    const socketInstance = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Handle incoming messages
    socketInstance.on("message", message => {
      setMessages(prev => [...prev, message]);
      setUnreadCount(prev => prev + 1);
    });

    // Handle user joined
    socketInstance.on("userJoined", data => {
      setUsers(prev => [...prev, data.user]);
      toast.info(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    });

    // Handle user left
    socketInstance.on("userLeft", data => {
      setUsers(prev => prev.filter(user => user.id !== data.user.id));
      toast.info(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    });

    // Handle users list
    socketInstance.on("usersList", usersList => {
      setUsers(usersList);
    });

    // Handle typing status
    socketInstance.on("userTyping", ({ userId, userName, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userName);
        } else {
          newSet.delete(userName);
        }
        return newSet;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = text => {
    if (socket && text.trim()) {
      socket.emit("sendMessage", { text });
    }
  };

  const joinChat = userData => {
    if (socket) {
      socket.emit("userJoin", userData);
    }
  };

  const setTyping = isTyping => {
    if (socket) {
      socket.emit("typing", isTyping);
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const value = {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    notifications,
    unreadCount,
    sendMessage,
    joinChat,
    setTyping,
    markAsRead,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
