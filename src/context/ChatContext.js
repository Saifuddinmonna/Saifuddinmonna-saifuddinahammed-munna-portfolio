import React, { createContext, useContext, useState, useEffect } from "react";
import { chatService, handleApiError } from "../services/api";
import socketService from "../services/socket";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();

    // Subscribe to socket events
    socketService.subscribe("message", handleNewMessage);
    socketService.subscribe("typing", handleTyping);
    socketService.subscribe("userJoined", handleUserJoined);
    socketService.subscribe("userLeft", handleUserLeft);

    // Load initial data
    loadRooms();

    // Cleanup on unmount
    return () => {
      socketService.unsubscribe("message", handleNewMessage);
      socketService.unsubscribe("typing", handleTyping);
      socketService.unsubscribe("userJoined", handleUserJoined);
      socketService.unsubscribe("userLeft", handleUserLeft);
      socketService.disconnect();
    };
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await chatService.getRooms();
      setRooms(response.data);
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async roomId => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(roomId);
      setMessages(response.data);
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = message => {
    setMessages(prev => [...prev, message]);
  };

  const handleTyping = ({ userId, isTyping }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleUserJoined = user => {
    toast.info(`${user.name} joined the chat`);
  };

  const handleUserLeft = user => {
    toast.info(`${user.name} left the chat`);
  };

  const sendMessage = async message => {
    try {
      await chatService.sendMessage(message);
      socketService.sendMessage(message);
    } catch (error) {
      const { message: errorMessage } = handleApiError(error);
      toast.error(errorMessage);
    }
  };

  const joinRoom = async roomId => {
    try {
      await loadMessages(roomId);
      socketService.joinRoom(roomId);
      setCurrentRoom(roomId);
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
    }
  };

  const leaveRoom = roomId => {
    socketService.leaveRoom(roomId);
    setCurrentRoom(null);
    setMessages([]);
  };

  const createRoom = async roomData => {
    try {
      const response = await chatService.createRoom(roomData);
      setRooms(prev => [...prev, response.data]);
      toast.success("Room created successfully");
      return response.data;
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
      throw error;
    }
  };

  const value = {
    messages,
    rooms,
    currentRoom,
    typingUsers,
    loading,
    sendMessage,
    joinRoom,
    leaveRoom,
    createRoom,
    loadRooms,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
