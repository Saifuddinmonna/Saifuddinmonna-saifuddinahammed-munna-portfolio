import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaSmile, FaLink, FaBars, FaUsers, FaUser } from "react-icons/fa";
import { useSocket } from "../SocketProvider";
import { useAuth } from "../../auth/context/AuthContext"; // To get the main user email/displayName
import EmojiPicker from "emoji-picker-react"; // Import EmojiPicker
import { toast } from "react-hot-toast";

const ChatWindow = ({ isChatOpen, onCloseChat }) => {
  const { socket, isConnected, dbUser, users, typingUsers, joinAsGuest } = useSocket();
  const { user: firebaseUser } = useAuth(); // Firebase user for displayName/email
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState("public"); // 'public', 'private', 'room', 'admin_panel'
  const [selectedPrivateChatUser, setSelectedPrivateChatUser] = useState(null); // For private chat
  const messagesEndRef = useRef(null);

  // Guest User States
  const [guestName, setGuestName] = useState(() => localStorage.getItem("guestName") || "");
  const [guestPhone, setGuestPhone] = useState(() => localStorage.getItem("guestPhone") || "");
  const [isGuestRegistered, setIsGuestRegistered] = useState(() => {
    // Check if a guest name is already in local storage (implies they've registered before)
    return !!localStorage.getItem("guestName");
  });
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

    // Request message history when chat opens or socket connects
    if (isChatOpen && isConnected) {
      socket.emit("requestMessageHistory", {
        type: activeChatTab,
        targetId: selectedPrivateChatUser?.id,
      }); // Request history based on tab
    }

    return () => {
      socket.off("message", handleReceiveMessage);
      socket.off("messageHistory", handleMessageHistory);
    };
  }, [socket, isChatOpen, isConnected, activeChatTab, selectedPrivateChatUser]); // Depend on chat tab and selected user

  // Determine if user is registered or guest
  const isUserRegistered = !!dbUser;
  const isAdmin = dbUser?.role === "admin";

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
    const messagePayload = { text: messageText };

    if (activeChatTab === "private" && selectedPrivateChatUser) {
      messagePayload.receiverId = selectedPrivateChatUser.id; // Assuming user.id is the target ID
      socket.emit("sendMessage", messagePayload);
    } else if (activeChatTab === "room") {
      // For now, assume a general room or logic to select room
      messagePayload.roomId = "general_room"; // Placeholder, replace with actual room ID
      socket.emit("sendMessage", messagePayload);
    } else if (activeChatTab === "admin_broadcast") {
      socket.emit("adminBroadcast", { text: messageText }); // New event for admin broadcast
    } else {
      // Public chat
      socket.emit("sendMessage", messagePayload);
    }

    setInputValue("");
    setShowEmojiPicker(false);
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

  const handleEmojiSelect = emojiData => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // URL parsing for messages, robustly checks for content property
  const renderMessageContent = msg => {
    console.log("renderMessageContent received msg:", msg); // Added for debugging
    let text = msg.text || msg.message || msg.content; // Prioritize 'text', then 'message', then 'content'
    console.log("renderMessageContent derived text:", text); // Added for debugging
    if (typeof text !== "string") {
      console.warn(
        "renderMessageContent received non-string or missing text/message/content:",
        msg
      );
      return String(text || ""); // Coerce to string, fallback to empty string if still null/undefined
    }
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
    // console.log("Debugging getSenderDisplay for msg:", msg);

    let senderId = msg.senderId || msg.sender?.id || msg._id; // _id from historical messages
    let senderName = msg.senderName || msg.sender?.name || msg.sender?.displayName; // Added msg.sender?.displayName
    let senderRole = msg.senderRole || msg.sender?.role;

    // Fallback for senderName/Role if not found in direct properties or nested sender
    if (!senderName) {
      // Check if it's a guest message, where sender might be the socket.id without a full user object
      const guestUser = users.find(u => u.id === senderId && u.isGuest);
      if (guestUser) {
        senderName = guestUser.name || "Guest";
        senderRole = "guest";
      } else {
        senderName = "Unknown";
      }
    }

    const currentUserId = dbUser?.firebaseUid || firebaseUser?.uid || socket.id;

    const isMe =
      senderId === currentUserId ||
      (firebaseUser && senderId === firebaseUser.uid) ||
      (socket.id === senderId && !dbUser && !firebaseUser); // This covers the initial guest connection without a user db entry

    if (isMe) {
      senderName = dbUser?.name || firebaseUser?.displayName || guestName || "Me";
      senderRole = dbUser?.role || (guestName ? "guest" : "user"); // 'guest' if guestName exists, else 'user'
    }

    return `${senderName} ${senderRole ? `(${senderRole})` : ""}`;
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
              {/* Chat Tabs / Admin Panel Toggle */}
              {isAdmin && (
                <div className="flex justify-around bg-[var(--background-elevated)] p-2 border-b border-[var(--border-color)]">
                  <button
                    onClick={() => setActiveChatTab("public")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeChatTab === "public"
                        ? "bg-[var(--primary-main)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background-hover)]"
                    }`}
                  >
                    Public Chat
                  </button>
                  <button
                    onClick={() => setActiveChatTab("private")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeChatTab === "private"
                        ? "bg-[var(--primary-main)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background-hover)]"
                    }`}
                  >
                    Private Chat
                  </button>
                  <button
                    onClick={() => setActiveChatTab("admin_panel")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeChatTab === "admin_panel"
                        ? "bg-[var(--primary-main)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background-hover)]"
                    }`}
                  >
                    Admin Panel
                  </button>
                </div>
              )}

              {/* Chat Content based on activeChatTab */}
              {activeChatTab === "admin_panel" && isAdmin ? (
                <div className="flex-1 p-4 overflow-y-auto bg-[var(--background-default)] flex flex-col space-y-4">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                    Admin Actions
                  </h4>
                  {/* Broadcast Message */}
                  <div className="bg-[var(--background-paper)] p-4 rounded-lg shadow">
                    <h5 className="font-semibold text-[var(--text-primary)] mb-2">
                      Send Broadcast Message
                    </h5>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const text = e.target.broadcastMessage.value;
                        if (text.trim()) {
                          socket.emit("adminBroadcast", { text });
                          e.target.broadcastMessage.value = "";
                          toast.success("Broadcast message sent!");
                        }
                      }}
                      className="flex space-x-2"
                    >
                      <input
                        type="text"
                        name="broadcastMessage"
                        placeholder="Message to all users"
                        className="flex-1 px-3 py-2 rounded-full border border-[var(--border-color)] bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-[var(--primary-main)] text-white rounded-full hover:bg-[var(--primary-dark)] transition-colors"
                      >
                        <FaPaperPlane className="w-5 h-5" />
                      </button>
                    </form>
                  </div>

                  {/* Online Users for Private Chat */}
                  <div className="bg-[var(--background-paper)] p-4 rounded-lg shadow">
                    <h5 className="font-semibold text-[var(--text-primary)] mb-2">
                      Online Users ({users.length})
                    </h5>
                    {users.length === 0 && (
                      <p className="text-sm text-[var(--text-secondary)]">No users online.</p>
                    )}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {users.map(userItem => (
                        <button
                          key={userItem.id}
                          onClick={() => {
                            setSelectedPrivateChatUser(userItem);
                            setActiveChatTab("private");
                            toast.info(`Private chat with ${userItem.name} selected.`);
                          }}
                          className="w-full text-left p-2 rounded-md bg-[var(--background-default)] hover:bg-[var(--background-hover)] text-[var(--text-primary)] flex items-center space-x-2"
                        >
                          <FaUser className="w-4 h-4" />
                          <span>
                            {userItem.name} {userItem.role && `(${userItem.role})`}
                          </span>
                          {selectedPrivateChatUser?.id === userItem.id && (
                            <span className="ml-auto text-xs text-[var(--primary-main)]">
                              (Selected)
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Private Chat Header for Admin */}
                  {isAdmin && activeChatTab === "private" && selectedPrivateChatUser && (
                    <div className="p-2 bg-[var(--background-elevated)] text-[var(--text-primary)] border-b border-[var(--border-color)] flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Private chat with {selectedPrivateChatUser.name}
                      </span>
                      <button
                        onClick={() => setSelectedPrivateChatUser(null)}
                        className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--background-hover)]"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
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
                          getSenderDisplay(msg).includes("Me") ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg shadow-sm
                                     ${
                                       getSenderDisplay(msg).includes("Me")
                                         ? "bg-[var(--primary-light)] text-[var(--text-primary)]"
                                         : "bg-[var(--background-elevated)] text-[var(--text-primary)]"
                                     }
                                    `}
                        >
                          <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">
                            {getSenderDisplay(msg)}
                          </p>
                          <p className="text-sm break-words">{renderMessageContent(msg)}</p>
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
                      {Array.from(typingUsers).join(", ")} {typingUsers.size > 1 ? "are" : "is"}
                      typing...
                    </div>
                  )}

                  {/* Input Area */}
                  <form
                    onSubmit={sendMessage}
                    className="p-4 border-t border-[var(--border-color)] bg-[var(--background-paper)] relative"
                  >
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiSelect} width={300} height={400} />
                      </div>
                    )}
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
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
