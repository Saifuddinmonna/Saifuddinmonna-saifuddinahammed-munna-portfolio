import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { socketService } from "./socket";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [roomMessages, setRoomMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [activeRooms, setActiveRooms] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      setConnected(false);
      return;
    }

    try {
      // Initialize socket connection
      socketService.connect(token);

      // Set up event listeners
      socketService.onUserJoined(data => {
        setUsers(prev => [...prev, data.user]);
      });

      socketService.onUserLeft(data => {
        setUsers(prev => prev.filter(u => u.id !== data.user.id));
      });

      socketService.onUsersList(usersList => {
        setUsers(usersList);
      });

      socketService.onMessage(message => {
        console.log("Received public message:", message);
        setMessages(prev => [...prev, message]);
      });

      socketService.onPrivateMessage(message => {
        console.log("Received private message:", message);
        setPrivateMessages(prev => ({
          ...prev,
          [message.sender.uid]: [...(prev[message.sender.uid] || []), message],
        }));
      });

      socketService.onRoomMessage(message => {
        console.log("Received room message:", message);
        setRoomMessages(prev => ({
          ...prev,
          [message.roomId]: [...(prev[message.roomId] || []), message],
        }));
      });

      socketService.onMessageHistory(history => {
        console.log("Received message history:", history);
        setMessages(history);
      });

      socketService.onPrivateMessageHistory(history => {
        const messagesByUser = history.reduce((acc, message) => {
          const userId = message.sender.uid;
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(message);
          return acc;
        }, {});
        setPrivateMessages(messagesByUser);
      });

      socketService.onRoomMessageHistory(history => {
        const messagesByRoom = history.reduce((acc, message) => {
          const roomId = message.roomId;
          if (!acc[roomId]) {
            acc[roomId] = [];
          }
          acc[roomId].push(message);
          return acc;
        }, {});
        setRoomMessages(messagesByRoom);
      });

      socketService.onUserTyping(data => {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
      });

      socketService.onUnreadCounts(counts => {
        setUnreadCounts(counts);
      });

      socketService.onError(error => {
        setError(error);
        console.error("Socket error:", error);
      });

      // Join chat
      socketService.joinChat({
        token,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });

      setConnected(true);

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        setConnected(false);
      };
    } catch (error) {
      console.error("Socket initialization error:", error);
      setError(error);
      setConnected(false);
    }
  }, [user, token]);

  // Token expiration handling
  useEffect(() => {
    const handleTokenExpiring = event => {
      // Handle token expiration
      console.log("Token expiring:", event.detail);
      // You can implement your token refresh logic here
    };

    window.addEventListener("tokenExpiring", handleTokenExpiring);
    return () => {
      window.removeEventListener("tokenExpiring", handleTokenExpiring);
    };
  }, []);

  const value = {
    connected,
    users,
    messages,
    privateMessages,
    roomMessages,
    unreadCounts,
    typingUsers,
    activeRooms,
    error,
    sendPrivateMessage: socketService.sendPrivateMessage.bind(socketService),
    sendRoomMessage: socketService.sendRoomMessage.bind(socketService),
    sendPublicMessage: socketService.sendPublicMessage.bind(socketService),
    requestPublicHistory: socketService.requestPublicHistory.bind(socketService),
    requestPrivateHistory: socketService.requestPrivateHistory.bind(socketService),
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
    sendTypingStatus: socketService.sendTypingStatus.bind(socketService),
    markMessageAsRead: socketService.markMessageAsRead.bind(socketService),
    markAllMessagesAsRead: socketService.markAllMessagesAsRead.bind(socketService),
    markPrivateMessageAsRead: socketService.markPrivateMessageAsRead.bind(socketService),
    editPrivateMessage: socketService.editPrivateMessage.bind(socketService),
    deletePrivateMessage: socketService.deletePrivateMessage.bind(socketService),
    getUnreadCount: socketService.getUnreadCount.bind(socketService),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
