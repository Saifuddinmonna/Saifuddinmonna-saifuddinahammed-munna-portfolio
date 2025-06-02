import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import {
  FaPaperPlane,
  FaUser,
  FaSmile,
  FaImage,
  FaEllipsisV,
  FaMicrophone,
  FaVideo,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";

const LiveChat = () => {
  const { user } = useAuth();
  const { messages, rooms, currentRoom, typingUsers, loading, sendMessage, joinRoom, leaveRoom } =
    useChat();
  const { socket, isConnected, setTyping } = useSocket();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (rooms.length > 0 && !currentRoom) {
      joinRoom(rooms[0].id);
    }
  }, [rooms, currentRoom, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isConnected) {
      toast.error("Not connected to chat server");
    }
  }, [isConnected]);

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        roomId: currentRoom,
        content: message,
        sender: user,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
      setIsTyping(false);
      setTyping(false);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleTyping = e => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      setTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(false);
    }, 2000);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const handleRoomChange = async roomId => {
    if (currentRoom) {
      leaveRoom(currentRoom);
    }
    await joinRoom(roomId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Room Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {currentRoom?.charAt(0).toUpperCase()}
            </div>
            <div>
              <select
                value={currentRoom}
                onChange={e => handleRoomChange(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:ring-0 dark:text-white"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {typingUsers.size > 0
                  ? `${Array.from(typingUsers).join(", ")} is typing...`
                  : "Online"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FaPhone className="text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FaVideo className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setShowRoomInfo(!showRoomInfo)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FaInfoCircle className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.sender.id === socket?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.sender.id === socket?.id
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FaUser className="text-xs" />
                  </div>
                  <span className="font-semibold text-sm">{msg.sender.name}</span>
                </div>
                <p className="break-words">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <FaSmile />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <FaImage />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-12"
            />
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                isRecording ? "bg-red-500 text-white" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <FaMicrophone />
            </button>
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>

      {/* Room Info Sidebar */}
      <AnimatePresence>
        {showRoomInfo && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 border-l dark:border-gray-700 shadow-lg"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Room Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Room Name
                  </h4>
                  <p className="text-gray-800 dark:text-white">{currentRoom}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active Users
                  </h4>
                  <p className="text-gray-800 dark:text-white">{typingUsers.size} online</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveChat;
