import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaSmile, FaLink, FaBars } from "react-icons/fa";
import { useSocket } from "../SocketProvider";
import { useAuth } from "../../auth/context/AuthContext"; // To get the main user email/displayName

const ChatWindow = ({ isChatOpen, onCloseChat }) => {
  const { socket, isConnected, dbUser, users, typingUsers, joinAsGuest } = useSocket();
  const { user: firebaseUser } = useAuth(); // Firebase user for displayName/email
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Guest User States
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isGuestRegistered, setIsGuestRegistered] = useState(false); // Tracks if guest has submitted details
  const [isTyping, setIsTyping] = useState(false); // Local typing state
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = message => {
      console.log("New message received:", message);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    const handleMessageHistory = history => {
      console.log("Message history received:", history);
      setMessages(history);
      scrollToBottom();
    };

    socket.on("message", handleReceiveMessage);
    socket.on("messageHistory", handleMessageHistory);

    return () => {
      socket.off("message", handleReceiveMessage);
      socket.off("messageHistory", handleMessageHistory);
    };
  }, [socket]);

  // Determine if user is registered or guest
  const isUserRegistered = !!dbUser;

  // Set guest registered status based on dbUser presence, or if guest details were submitted
  useEffect(() => {
    if (isUserRegistered) {
      setIsGuestRegistered(true); // If registered, they don't need guest form
    } else if (localStorage.getItem("guestId")) {
      // Check if a guest ID already exists from a previous session
      setIsGuestRegistered(true);
    }
  }, [isUserRegistered]);

  const handleGuestJoin = e => {
    e.preventDefault();
    if (guestName.trim() === "") {
      alert("Please enter your name to chat as a guest.");
      return;
    }
    joinAsGuest(guestName.trim(), guestPhone.trim() || null);
    setIsGuestRegistered(true); // Mark guest as registered for this session
    localStorage.setItem("guestName", guestName.trim()); // Persist guest name
    if (guestPhone.trim()) localStorage.setItem("guestPhone", guestPhone.trim()); // Persist guest phone
  };

  const sendMessage = e => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const messageText = inputValue.trim();
    // Emit 'sendMessage' as per server API
    socket.emit("sendMessage", { text: messageText });
    setInputValue("");
    setShowEmojiPicker(false);

    // Reset typing status after sending message
    sendTypingStatus(false);
  };

  const sendTypingStatus = useCallback(
    typing => {
      if (!socket) return;
      if (typing !== isTyping) {
        // Only emit if status changes
        socket.emit("typing", typing);
        setIsTyping(typing);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (typing) {
          // Set a timeout to automatically stop typing after a short period of inactivity
          typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing", false);
            setIsTyping(false);
          }, 3000); // Stop typing after 3 seconds of no input
        }
      }
    },
    [socket, isTyping]
  );

  const handleInputChange = e => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      sendTypingStatus(true);
    } else {
      sendTypingStatus(false);
    }
  };

  // Placeholder for emoji picker logic
  const handleEmojiSelect = emoji => {
    setInputValue(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // URL parsing for messages
  const renderMessageContent = text => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Determine sender display name and role for messages
  const getSenderDisplay = msg => {
    const isMe = msg.senderId === (dbUser?.firebaseUid || firebaseUser?.uid || socket.id);
    let name = msg.senderName || "Unknown";
    let role = msg.senderRole || "";

    if (isMe) {
      name = dbUser?.name || firebaseUser?.displayName || "Me";
      role = dbUser?.role || "user";
    }
    return `${name} ${role ? `(${role})` : ""}`;
  };

  if (!isChatOpen) return null; // Render nothing if chat is closed

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed bottom-4 right-4 w-[35vw] h-[70vh] bg-[var(--background-paper)] rounded-lg shadow-xl flex flex-col z-[999] border border-[var(--border-color)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[var(--primary-main)] text-white rounded-t-lg shadow-md">
            <h3 className="text-lg font-semibold">Live Chat</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isConnected ? "text-green-300" : "text-red-300"}`}>
                {isConnected ? "Online" : "Offline"}
              </span>
              <button
                onClick={onCloseChat}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isUserRegistered && !isGuestRegistered ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Chat as Guest
              </h4>
              <form onSubmit={handleGuestJoin} className="w-full max-w-xs space-y-4">
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Your Name (required)"
                  className="w-full px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  required
                />
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="Your Phone / WhatsApp (optional)"
                  className="w-full px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-[var(--primary-main)] text-white rounded-full hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-[var(--text-primary)]">
                {messages.length === 0 && (
                  <p className="text-center text-[var(--text-secondary)]">
                    {isConnected
                      ? "No messages yet. Say hello!"
                      : "Connecting... Messages will appear here."}
                  </p>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderId === (dbUser?.firebaseUid || firebaseUser?.uid)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm
                                 ${
                                   msg.senderId === (dbUser?.firebaseUid || firebaseUser?.uid)
                                     ? "bg-[var(--primary-light)] text-[var(--text-primary)]"
                                     : "bg-[var(--background-elevated)] text-[var(--text-primary)]"
                                 }
                                `}
                    >
                      <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">
                        {getSenderDisplay(msg)}
                      </p>
                      <p className="text-sm break-words">{renderMessageContent(msg.text)}</p>
                      <p className="text-right text-xs text-[var(--text-tertiary)] mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="px-4 text-xs text-[var(--text-secondary)]">
                  {Array.from(typingUsers).join(", ")} {typingUsers.size > 1 ? "are" : "is"}{" "}
                  typing...
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-[var(--border-color)] bg-[var(--background-paper)]"
              >
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
                  >
                    <FaSmile className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[var(--primary-main)] text-white rounded-full hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    <FaPaperPlane className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
