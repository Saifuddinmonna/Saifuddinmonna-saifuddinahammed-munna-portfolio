import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { socket, joinChat, messages, users, typingUsers, sendMessage, setTyping } = useSocket();

  useEffect(() => {
    // Initialize chat with default user if not set
    if (!currentUser && socket) {
      const defaultUser = {
        name: `Guest-${Math.floor(Math.random() * 1000)}`,
        avatar: null,
      };
      setCurrentUser(defaultUser);
      joinChat(defaultUser);
    }
  }, [socket, currentUser, joinChat]);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const updateUser = userData => {
    setCurrentUser(userData);
    if (socket) {
      joinChat(userData);
    }
  };

  const value = {
    isChatOpen,
    openChat,
    closeChat,
    currentUser,
    updateUser,
    messages,
    users,
    typingUsers,
    sendMessage,
    setTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
