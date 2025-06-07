import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useSocket } from "../../context/SocketContext";
import { useChat } from "../../context/ChatContext";

const LiveChat = () => {
  const { socket, isConnected } = useSocket();
  const { isChatOpen, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      socket.on("chat message", message => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = e => {
    e.preventDefault();
    if (newMessage.trim() && username.trim()) {
      const messageData = {
        username,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("chat message", messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openChat}
            className="bg-[var(--primary-main)] text-white p-4 rounded-full shadow-lg"
          >
            <FaComments size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[var(--background-paper)] rounded-lg shadow-xl w-80 sm:w-96 border border-[var(--border-main)]"
          >
            <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Live Chat</h3>
              <button
                onClick={closeChat}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.username === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.username === username
                          ? "bg-[var(--primary-main)] text-white"
                          : "bg-[var(--background-elevated)] text-[var(--text-primary)]"
                      }`}
                    >
                      <p className="text-sm font-semibold">{msg.username}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-light)]">
                {!username && (
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-2 mb-2 rounded border border-[var(--border-main)] bg-[var(--background-elevated)] text-[var(--text-primary)]"
                    required
                  />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1 p-2 rounded border border-[var(--border-main)] bg-[var(--background-elevated)] text-[var(--text-primary)]"
                    disabled={!username}
                  />
                  <button
                    type="submit"
                    disabled={!username || !newMessage.trim()}
                    className="bg-[var(--primary-main)] text-white p-2 rounded disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveChat;
