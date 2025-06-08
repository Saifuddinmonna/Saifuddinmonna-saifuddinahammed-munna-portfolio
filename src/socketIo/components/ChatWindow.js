import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaSmile, FaLink, FaBars, FaUsers, FaUser } from "react-icons/fa";
import { useSocket } from "../SocketProvider";
import { useAuth } from "../../auth/context/AuthContext"; // To get the main user email/displayName
import EmojiPicker from "emoji-picker-react"; // Import EmojiPicker
import { toast } from "react-hot-toast";

const ChatWindow = ({ isChatOpen, onCloseChat }) => {
  const {
    socket,
    isConnected,
    dbUser,
    users,
    typingUsers,
    joinAsGuest,
    messages: allMessages,
  } = useSocket();
  const { user: firebaseUser } = useAuth(); // Firebase user for displayName/email
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState("public"); // 'public', 'private', 'admin_panel'
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
  }, [allMessages, isChatOpen]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = message => {
      // Messages are now handled by SocketProvider and stored in `allMessages`
      // No need to set them here, but we might want to trigger scroll
      // setMessages(prevMessages => [...prevMessages, message]); // This is now done in SocketProvider
      scrollToBottom();
    };

    const handleMessageHistory = history => {
      // Message history is now handled by SocketProvider
      // We will rely on `allMessages` from context, so no need to set here
      // setMessages(history); // This is now done in SocketProvider
      scrollToBottom();
    };

    // Only listen for generic 'message' for public, others are handled by SocketProvider
    socket.on("message", handleReceiveMessage); // Still listen for public messages for scroll effect

    // Request message history when chat opens or socket connects
    // The request type (public/private/room) is now managed by activeChatTab
    if (isChatOpen && isConnected) {
      socket.emit("requestMessageHistory", {
        type: activeChatTab,
        targetId: selectedPrivateChatUser?.id,
        // Add currentRoom if you implement specific rooms beyond private/public
      });
    }

    return () => {
      socket.off("message", handleReceiveMessage);
    };
  }, [socket, isChatOpen, isConnected, activeChatTab, selectedPrivateChatUser, allMessages]); // Add allMessages to dependencies

  // Determine if user is registered or guest
  const isUserRegistered = !!dbUser;
  const isAdmin = dbUser?.data?.role === "admin"; // Access role from dbUser.data

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

    if (activeChatTab === "private" && selectedPrivateChatUser) {
      socket.emit("privateMessage", {
        receiverId: selectedPrivateChatUser.id,
        text: messageText,
      });
      toast.success(`Private message sent to ${selectedPrivateChatUser.name}`);
    } else if (activeChatTab === "room") {
      // This needs a way to select or enter a room
      const roomId = "general_room"; // Placeholder, you'll need UI for room selection
      socket.emit("roomMessage", { roomId, text: messageText });
      toast.success(`Message sent to room: ${roomId}`);
    } else if (activeChatTab === "admin_panel" && isAdmin) {
      // Admin panel actions
      // This is for broadcast, not a regular sendMessage
      socket.emit("adminBroadcast", { text: messageText });
      toast.success("Broadcast message sent!");
    } else {
      // Public chat
      socket.emit("sendMessage", { text: messageText });
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
    // Messages are now received with a 'type' property from SocketProvider
    // We need to decide what to render based on the current activeChatTab

    const isPrivate = msg.type === "private";
    const isRoom = msg.type === "room";
    const isBroadcast = msg.type === "broadcast";
    const isPublic = msg.type === "public";

    // Only render messages relevant to the current active tab
    if (
      (activeChatTab === "public" && isPublic) || // Only public messages for public tab
      (activeChatTab === "private" &&
        isPrivate &&
        ((msg.senderId === (dbUser?.firebaseUid || firebaseUser?.uid) &&
          msg.receiverId === selectedPrivateChatUser?.id) ||
          (msg.senderId === selectedPrivateChatUser?.id &&
            msg.receiverId === (dbUser?.firebaseUid || firebaseUser?.uid)))) ||
      (activeChatTab === "room" && isRoom) || // Further refinement needed for specific rooms
      (isAdmin && isBroadcast) // Admins can see broadcast messages
    ) {
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
    } else {
      return null; // Don't render messages not relevant to the current tab
    }
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

          {/* Tab Navigation */}
          <div className="flex justify-around bg-[var(--background-default)] border-b border-[var(--border-color)] p-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeChatTab === "public"
                  ? "bg-[var(--primary-main)] text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
              }`}
              onClick={() => {
                setActiveChatTab("public");
                setSelectedPrivateChatUser(null);
              }}
            >
              Public Chat
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeChatTab === "private"
                  ? "bg-[var(--primary-main)] text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
              }`}
              onClick={() => {
                setActiveChatTab("private");
              }}
            >
              Private Chat
            </button>
            {isAdmin && (
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeChatTab === "admin_panel"
                    ? "bg-[var(--primary-main)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
                }`}
                onClick={() => {
                  setActiveChatTab("admin_panel");
                  setSelectedPrivateChatUser(null);
                }}
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {!isUserRegistered && !isGuestRegistered ? (
              // Guest Registration Form
              <form
                onSubmit={handleGuestJoin}
                className="space-y-4 p-4 bg-[var(--background-paper)] rounded-lg shadow"
              >
                <p className="text-center text-[var(--text-secondary)]">Join as a guest to chat</p>
                <div>
                  <label htmlFor="guestName" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guestPhone" className="sr-only">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="guestPhone"
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="w-full px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--primary-main)] text-white py-2 rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Join Chat
                </button>
              </form>
            ) : (
              // Main Chat Area or Admin Panel
              <>
                {activeChatTab === "public" && (
                  <div>
                    {allMessages
                      .filter(msg => msg.type === "public")
                      .map((msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start mb-4 ${
                            msg.senderId === (dbUser?.firebaseUid || firebaseUser?.uid || socket.id)
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[70%] ${
                              msg.senderId ===
                              (dbUser?.firebaseUid || firebaseUser?.uid || socket.id)
                                ? "bg-[var(--primary-main)] text-white"
                                : "bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)]"
                            }`}
                          >
                            <div className="font-semibold text-sm mb-1">
                              {getSenderDisplay(msg)}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {renderMessageContent(msg)}
                            </p>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {activeChatTab === "private" && (
                  <div className="h-full flex flex-col">
                    {!selectedPrivateChatUser ? (
                      <div className="p-4 text-center text-[var(--text-secondary)]">
                        <h4 className="text-lg font-semibold mb-4">
                          Select a user for private chat:
                        </h4>
                        <ul className="space-y-2">
                          {users
                            .filter(
                              u =>
                                u.id !== (dbUser?.firebaseUid || firebaseUser?.uid || socket.id) &&
                                u.id !== "guest_placeholder_id"
                            )
                            .map(user => (
                              <li key={user.id}>
                                <button
                                  onClick={() => {
                                    setSelectedPrivateChatUser(user);
                                    toast.success(
                                      `Started private chat with ${user.name || user.displayName}`
                                    );
                                  }}
                                  className="w-full text-left px-4 py-2 rounded-md bg-[var(--background-default)] hover:bg-[var(--background-hover)] text-[var(--text-primary)] transition-colors duration-200 flex items-center"
                                >
                                  <FaUser className="mr-2" />
                                  {user.name || user.displayName || user.id}{" "}
                                  {user.role ? `(${user.role})` : ""}
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ) : (
                      // Private chat window with selected user
                      <>
                        <div className="flex items-center justify-between p-3 bg-[var(--background-default)] border-b border-[var(--border-color)] rounded-t-lg">
                          <button
                            onClick={() => setSelectedPrivateChatUser(null)}
                            className="text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                          >
                            <FaBars className="w-5 h-5" />
                          </button>
                          <h4 className="font-semibold text-[var(--text-primary)]">
                            Private Chat with{" "}
                            {selectedPrivateChatUser.name || selectedPrivateChatUser.displayName}
                          </h4>
                          <div></div> {/* Placeholder for alignment */}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                          {allMessages
                            .filter(
                              msg =>
                                msg.type === "private" &&
                                ((msg.senderId ===
                                  (dbUser?.firebaseUid || firebaseUser?.uid || socket.id) &&
                                  msg.receiverId === selectedPrivateChatUser?.id) ||
                                  (msg.senderId === selectedPrivateChatUser?.id &&
                                    msg.receiverId ===
                                      (dbUser?.firebaseUid || firebaseUser?.uid || socket.id)))
                            )
                            .map((msg, index) => (
                              <div
                                key={index}
                                className={`flex items-start mb-4 ${
                                  msg.senderId ===
                                  (dbUser?.firebaseUid || firebaseUser?.uid || socket.id)
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`rounded-lg p-3 max-w-[70%] ${
                                    msg.senderId ===
                                    (dbUser?.firebaseUid || firebaseUser?.uid || socket.id)
                                      ? "bg-[var(--primary-main)] text-white"
                                      : "bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)]"
                                  }`}
                                >
                                  <div className="font-semibold text-sm mb-1">
                                    {getSenderDisplay(msg)}
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {renderMessageContent(msg)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {isAdmin && activeChatTab === "admin_panel" && (
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                      Admin Panel
                    </h4>
                    <div className="mb-6">
                      <h5 className="text-md font-semibold text-[var(--text-primary)] mb-2">
                        Active Users:
                      </h5>
                      <ul className="space-y-2">
                        {users.map(user => (
                          <li
                            key={user.id}
                            className="flex items-center justify-between bg-[var(--background-default)] p-2 rounded-md border border-[var(--border-color)]"
                          >
                            <span className="text-[var(--text-primary)]">
                              {user.name || user.displayName || "Guest"}{" "}
                              {user.role ? `(${user.role})` : ""}
                            </span>
                            <button
                              onClick={() => {
                                setActiveChatTab("private");
                                setSelectedPrivateChatUser(user);
                                toast.success(
                                  `Initiated private chat with ${user.name || user.displayName}`
                                );
                              }}
                              className="ml-2 px-3 py-1 text-xs bg-[var(--primary-main)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                            >
                              Private Chat
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Admin Broadcast Feature */}
                    <div className="mb-6">
                      <h5 className="text-md font-semibold text-[var(--text-primary)] mb-2">
                        Broadcast Message:
                      </h5>
                      <form onSubmit={sendMessage} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          placeholder="Type broadcast message..."
                          className="flex-1 px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-[var(--primary-main)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                          onClick={() => setActiveChatTab("admin_panel")} // Ensure sendMessage knows it's a broadcast
                        >
                          <FaPaperPlane />
                        </button>
                      </form>
                    </div>

                    {/* Other admin features can go here (e.g., room management) */}
                  </div>
                )}

                {/* Typing indicators */}
                {typingUsers.size > 0 && (
                  <div className="text-sm text-[var(--text-secondary)] mb-2 px-4 italic">
                    {Array.from(typingUsers).join(", ")} is typing...
                  </div>
                )}

                {/* Message Input (hidden for admin panel broadcast, shown for other tabs) */}
                {activeChatTab !== "admin_panel" && (
                  <form
                    onSubmit={sendMessage}
                    className="flex items-center p-4 border-t border-[var(--border-color)] bg-[var(--background-paper)]"
                  >
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
                      placeholder={
                        selectedPrivateChatUser
                          ? `Message ${
                              selectedPrivateChatUser.name || selectedPrivateChatUser.displayName
                            }`
                          : "Type your message..."
                      }
                      className="flex-1 mx-2 px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[var(--primary-main)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                )}

                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-4 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
