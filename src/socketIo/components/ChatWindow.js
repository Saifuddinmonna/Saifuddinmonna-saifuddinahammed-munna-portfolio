import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaSmile, FaLink, FaBars, FaUsers, FaUser } from "react-icons/fa";
import { useSocket } from "../SocketProvider";
import { useAuth } from "../../auth/context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatWindow = ({ isChatOpen, onCloseChat }) => {
  const {
    socket,
    isConnected,
    dbUser,
    users,
    typingUsers,
    joinAsGuest,
    messages: allMessages,
    hasUnreadPrivateMessages,
    setHasUnreadPrivateMessages,
    groups,
    selectedGroup,
    setSelectedGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    privateChats,
  } = useSocket();
  const { user: firebaseUser } = useAuth(); // Firebase user for auth status
  console.log("console log for firebase user", firebaseUser, dbUser?.data?.role);
  const navigate = useNavigate(); // Initialize useNavigate
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState("public"); // 'public', 'private', 'admin_panel', 'group'
  const [selectedPrivateChatUser, setSelectedPrivateChatUser] = useState(null); // For private chat
  const messagesEndRef = useRef(null);

  // Guest User States
  const [guestName, setGuestName] = useState(() => localStorage.getItem("guestName") || "");
  const [guestPhone, setGuestPhone] = useState(() => localStorage.getItem("guestPhone") || "");
  const [isGuestRegistered, setIsGuestRegistered] = useState(() => {
    return !!localStorage.getItem("guestName");
  });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Scroll to bottom when messages change or chat opens (if user is logged in)
  useEffect(() => {
    if (isChatOpen && firebaseUser) {
      // Check firebaseUser here
      scrollToBottom();
    }
  }, [isChatOpen, allMessages, scrollToBottom, firebaseUser]);

  // Get messages for current chat
  const currentMessages = useMemo(() => {
    if (activeChatTab === "private" && selectedPrivateChatUser) {
      // Get messages for the selected private chat
      return privateChats[selectedPrivateChatUser.id] || [];
    } else if (activeChatTab === "public") {
      // Filter public messages
      return allMessages.filter(msg => msg.type === "public");
    } else if (activeChatTab === "group" && selectedGroup) {
      // Filter group messages
      return allMessages.filter(msg => msg.type === "room" && msg.roomId === selectedGroup.id);
    }
    return [];
  }, [activeChatTab, selectedPrivateChatUser, selectedGroup, allMessages, privateChats]);

  // Request message history when chat opens or socket connects (if user is logged in)
  useEffect(() => {
    if (!socket || !isChatOpen || !isConnected || !firebaseUser) return; // Add firebaseUser check

    console.log("Requesting message history for tab:", activeChatTab);

    if (activeChatTab === "public") {
      socket.emit("requestPublicHistory");
    } else if (activeChatTab === "private" && selectedPrivateChatUser?.id) {
      console.log("Requesting private history for user:", selectedPrivateChatUser.id);
      socket.emit("requestPrivateHistory", { targetId: selectedPrivateChatUser.id });
    } else if (activeChatTab === "group" && selectedGroup?.id) {
      socket.emit("requestRoomHistory", { roomId: selectedGroup.id });
    }
  }, [socket, isChatOpen, isConnected, activeChatTab, selectedPrivateChatUser, selectedGroup]);

  // Handle tab changes
  const handleTabChange = tab => {
    setActiveChatTab(tab);
    if (tab === "private") {
      setHasUnreadPrivateMessages(false);
    }
    // Request message history for the new tab
    if (socket && isConnected && firebaseUser) {
      // Add firebaseUser check
      if (tab === "public") {
        socket.emit("requestPublicHistory");
      } else if (tab === "private" && selectedPrivateChatUser?.id) {
        socket.emit("requestPrivateHistory", { targetId: selectedPrivateChatUser.id });
      } else if (tab === "group" && selectedGroup?.id) {
        socket.emit("requestRoomHistory", { roomId: selectedGroup.id });
      }
    }
  };

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
    } else if (activeChatTab === "group" && selectedGroup) {
      socket.emit("roomMessage", {
        // Changed to roomMessage to match server
        roomId: selectedGroup.id,
        text: messageText,
      });
      toast.success(`Message sent to group: ${selectedGroup.name}`);
    } else if (activeChatTab === "admin_panel" && isAdmin) {
      // Admin panel actions
      // This is for broadcast, not a regular sendMessage
      socket.emit("adminBroadcast", { text: messageText });
      toast.success("Broadcast message sent!");
    } else {
      // Public chat
      socket.emit("publicMessage", { text: messageText }); // Changed to publicMessage to match server
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

  // Define getSenderDisplay first
  const getSenderDisplay = useCallback(msg => {
    console.log("getSenderDisplay received msg:", msg);

    // Handle both direct senderId and nested sender object
    const senderId = msg.senderId || msg.sender?.uid || msg.sender?.id;
    const senderName = msg.senderName || msg.sender?.name;
    const senderRole = msg.senderRole || msg.sender?.role;
    const senderEmail = msg.senderEmail || msg.sender?.email;

    console.log("Extracted sender details:", { senderId, senderName, senderRole, senderEmail });

    // If we have a sender name, use it
    if (senderName) {
      return `${senderName}${senderRole ? ` (${senderRole})` : ""}`;
    }

    // If we have an email but no name, use the email
    if (senderEmail) {
      return `${senderEmail}${senderRole ? ` (${senderRole})` : ""}`;
    }

    // If we have neither, use the ID
    return `User ${senderId?.substring(0, 6)}${senderRole ? ` (${senderRole})` : ""}`;
  }, []);

  // Define renderMessageContent second
  const renderMessageContent = useCallback(
    msg => {
      console.log("renderMessageContent received msg:", msg);

      const isPrivate = msg.type === "private";
      const isRoom = msg.type === "room";
      const isBroadcast = msg.type === "broadcast";
      const isPublic = msg.type === "public";
      const isGroup = msg.type === "group";

      if (
        (activeChatTab === "public" && isPublic) ||
        (activeChatTab === "private" && isPrivate) ||
        (activeChatTab === "group" && isGroup) ||
        (isAdmin && isBroadcast)
      ) {
        console.log("Message passed filter, attempting to render content");
        let text = msg.text || msg.message || msg.content;
        console.log("renderMessageContent derived text:", text);

        if (typeof text !== "string") {
          console.warn(
            "renderMessageContent received non-string or missing text/message/content:",
            msg
          );
          return String(text || "");
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
      }
      return null;
    },
    [activeChatTab, isAdmin]
  );

  // Debounced typing status update
  const debouncedTypingStatus = useCallback(
    typing => {
      if (!socket) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (typing !== isTyping) {
        socket.emit("typing", typing);
        setIsTyping(typing);

        if (typing) {
          typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing", false);
            setIsTyping(false);
          }, 3000);
        }
      }
    },
    [socket, isTyping]
  );

  if (!isChatOpen) return null;

  const renderSignInPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 right-5 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col items-center justify-center p-6"
      style={{ maxHeight: "70vh" }}
    >
      <FaTimes
        className="absolute top-3 right-3 text-gray-500 cursor-pointer"
        onClick={onCloseChat}
      />
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Sign in to Chat</h3>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please sign in to send messages and view your chat history.
      </p>
      <button
        onClick={() => {
          onCloseChat();
          navigate("/login");
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
      >
        Go to Sign In
      </button>
    </motion.div>
  );

  const renderChatContent = () => (
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
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleTabChange("public")}
          className={`px-4 py-2 rounded-md ${
            activeChatTab === "public"
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-default)] text-[var(--text-primary)]"
          }`}
        >
          Public Chat
        </button>
        <button
          onClick={() => handleTabChange("private")}
          className={`px-4 py-2 rounded-md relative ${
            activeChatTab === "private"
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-default)] text-[var(--text-primary)]"
          }`}
        >
          Private Chat
          {hasUnreadPrivateMessages && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </button>
        {isAdmin && (
          <button
            onClick={() => handleTabChange("admin_panel")}
            className={`px-4 py-2 rounded-md ${
              activeChatTab === "admin_panel"
                ? "bg-[var(--primary-main)] text-white"
                : "bg-[var(--background-default)] text-[var(--text-primary)]"
            }`}
          >
            Admin Panel
          </button>
        )}
        <button
          onClick={() => handleTabChange("group")}
          className={`px-4 py-2 rounded-md ${
            activeChatTab === "group"
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-default)] text-[var(--text-primary)]"
          }`}
        >
          Group Chat
        </button>
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
                {currentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${
                      msg.senderId === (dbUser?.firebaseUid || socket.id)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[70%] ${
                        msg.senderId === (dbUser?.firebaseUid || socket.id)
                          ? "bg-[var(--primary-main)] text-white"
                          : "bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)]"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1">{getSenderDisplay(msg)}</div>
                      <p className="text-sm whitespace-pre-wrap">{renderMessageContent(msg)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {activeChatTab === "private" && (
              <div className="flex-1 flex flex-col">
                {!selectedPrivateChatUser ? (
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                      Select a user to start private chat:
                    </h4>
                    <ul className="space-y-2">
                      {users
                        .filter(
                          u =>
                            u.uid !== (dbUser?.firebaseUid || firebaseUser?.uid) && // Filter out current user
                            u.id !== "guest_placeholder_id" // Filter out any placeholder guest IDs
                        )
                        .map(user => (
                          <li key={user.uid || user.id}>
                            <button
                              onClick={() => {
                                const userIdentifier = user.uid || user.id;
                                setSelectedPrivateChatUser({ ...user, id: userIdentifier });
                                console.log("Selected private chat user:", {
                                  ...user,
                                  id: userIdentifier,
                                });
                                // Request message history for the selected user
                                if (socket && isConnected) {
                                  socket.emit("requestPrivateHistory", {
                                    targetId: userIdentifier,
                                  });
                                }
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
                      <div></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {currentMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start mb-4 ${
                            msg.senderId === (dbUser?.firebaseUid || socket.id)
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[70%] ${
                              msg.senderId === (dbUser?.firebaseUid || socket.id)
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

            {activeChatTab === "group" && (
              <div className="h-full flex flex-col">
                {!selectedGroup ? (
                  <div className="p-4 text-center text-[var(--text-secondary)]">
                    <h4 className="text-lg font-semibold mb-4">Select or Create a Group:</h4>
                    <div className="space-y-4 mb-6">
                      <h5 className="font-semibold">Your Groups:</h5>
                      {groups.length === 0 ? (
                        <p className="text-sm">No groups available. Create one!</p>
                      ) : (
                        <ul className="space-y-2">
                          {groups.map(group => (
                            <li
                              key={group.id}
                              className="flex items-center justify-between bg-[var(--background-default)] p-2 rounded-md border border-[var(--border-color)]"
                            >
                              <span className="text-[var(--text-primary)]">{group.name}</span>
                              <div className="space-x-2">
                                {group.members.some(
                                  m => m.id === (dbUser?.firebaseUid || firebaseUser?.uid)
                                ) ? ( // Compare with user's UID
                                  <button
                                    onClick={() => {
                                      setSelectedGroup(group);
                                      console.log("Selected group:", group);
                                      toast.success(`Joined group: ${group.name}`);
                                    }}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    Open Chat
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => joinGroup(group.id)}
                                    className="px-3 py-1 text-xs bg-[var(--primary-main)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                                  >
                                    Join
                                  </button>
                                )}
                                {group.members.some(
                                  m => m.id === (dbUser?.firebaseUid || firebaseUser?.uid)
                                ) && (
                                  <button
                                    onClick={() => {
                                      leaveGroup(group.id);
                                      setSelectedGroup(null);
                                      toast.info(`Left group: ${group.name}`);
                                    }}
                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    Leave
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h5 className="font-semibold">Create New Group:</h5>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          const groupName = e.target.newGroupName.value.trim();
                          if (groupName) {
                            createGroup(groupName);
                            e.target.newGroupName.value = "";
                          } else {
                            toast.error("Group name cannot be empty.");
                          }
                        }}
                        className="flex space-x-2"
                      >
                        <input
                          type="text"
                          name="newGroupName"
                          placeholder="New Group Name"
                          className="flex-1 px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                          required
                        />
                        <button
                          type="submit"
                          className="p-2 bg-[var(--primary-main)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                        >
                          Create
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  // Group Chat Window with selected group
                  <>
                    <div className="flex items-center justify-between p-3 bg-[var(--background-default)] border-b border-[var(--border-color)] rounded-t-lg">
                      <button
                        onClick={() => setSelectedGroup(null)}
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                      >
                        <FaBars className="w-5 h-5" />
                      </button>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Group Chat: {selectedGroup.name}
                      </h4>
                      <div></div> {/* Placeholder for alignment */}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {currentMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start mb-4 ${
                            msg.senderId === (dbUser?.firebaseUid || socket.id)
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[70%] ${
                              msg.senderId === (dbUser?.firebaseUid || socket.id)
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
                        key={user.uid || user.id}
                        className="flex items-center justify-between bg-[var(--background-default)] p-2 rounded-md border border-[var(--border-color)]"
                      >
                        <span className="text-[var(--text-primary)]">
                          {user.name || user.displayName || "Guest"}{" "}
                          {user.role ? `(${user.role})` : ""}
                        </span>
                        <button
                          onClick={() => {
                            setActiveChatTab("private");
                            const userIdentifier = user.uid || user.id;
                            setSelectedPrivateChatUser({ ...user, id: userIdentifier }); // Ensure selected ID is the UID or guest _id
                            console.log("Admin selected private chat user:", {
                              ...user,
                              id: userIdentifier,
                            }); // Log the selected user
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
                className="flex items-center space-x-2 p-4 border-t border-[var(--border-color)]"
              >
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-[var(--text-primary)] hover:text-[var(--primary-main)] transition-colors"
                >
                  <FaSmile />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-md bg-[var(--background-default)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
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
  );

  return (
    <AnimatePresence>
      {isChatOpen && (!firebaseUser ? renderSignInPrompt() : renderChatContent())}
    </AnimatePresence>
  );
};

export default ChatWindow;
