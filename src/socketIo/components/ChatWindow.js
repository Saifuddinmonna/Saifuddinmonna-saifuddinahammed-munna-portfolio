import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaTimes,
  FaSmile,
  FaLink,
  FaBars,
  FaUsers,
  FaUser,
  FaEdit,
  FaTrash,
  FaCheck,
  FaCircle,
  FaSpinner,
  FaExclamationCircle,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { useSocket } from "../SocketProvider";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PrivateChatHistory from "./PrivateChatHistory";

const ChatWindow = ({ isChatOpen, onCloseChat }) => {
  const {
    connected,
    users = [],
    messages,
    privateMessages,
    roomMessages,
    typingUsers,
    unreadCounts,
    activeRooms,
    error,
    sendPrivateMessage,
    sendRoomMessage,
    sendPublicMessage,
    requestPublicHistory,
    requestPrivateHistory,
    joinRoom,
    leaveRoom,
    sendTypingStatus,
    markMessageAsRead,
    markAllMessagesAsRead,
    markPrivateMessageAsRead,
    editPrivateMessage,
    deletePrivateMessage,
    getUnreadCount,
    groups = [],
    selectedGroup,
    setSelectedGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    privateChats,
    socketService,
  } = useSocket();

  const { user: firebaseUser } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // State declarations
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState("public");
  const [selectedPrivateChatUser, setSelectedPrivateChatUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [guestName, setGuestName] = useState(() => localStorage.getItem("guestName") || "");
  const [guestPhone, setGuestPhone] = useState(() => localStorage.getItem("guestPhone") || "");
  const [isGuestRegistered, setIsGuestRegistered] = useState(
    () => !!localStorage.getItem("guestName")
  );
  const [showUserList, setShowUserList] = useState(false);
  const [showGroupList, setShowGroupList] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered users and groups based on search
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      user =>
        user.name?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        user.email?.toLowerCase().includes((searchQuery || "").toLowerCase())
    );
  }, [users, searchQuery]);

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    return groups.filter(group =>
      group.name.toLowerCase().includes((searchQuery || "").toLowerCase())
    );
  }, [groups, searchQuery]);

  const typingTimeoutRef = useRef(null);

  // Get messages for current chat
  const currentMessages = useMemo(() => {
    if (activeChatTab === "private" && selectedPrivateChatUser) {
      return privateMessages[selectedPrivateChatUser.uid] || [];
    } else if (activeChatTab === "public") {
      // Split messages into two columns for public chat
      const publicMessages = messages || [];
      const midPoint = Math.ceil(publicMessages.length / 2);
      return {
        left: publicMessages.slice(0, midPoint),
        right: publicMessages.slice(midPoint),
      };
    } else if (activeChatTab === "group" && selectedGroup) {
      return roomMessages[selectedGroup.id] || [];
    }
    return activeChatTab === "public" ? { left: [], right: [] } : [];
  }, [
    activeChatTab,
    selectedPrivateChatUser,
    selectedGroup,
    messages,
    privateMessages,
    roomMessages,
  ]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handle connection status
  useEffect(() => {
    if (isChatOpen && !connected && !isConnecting) {
      setIsConnecting(true);
      try {
        socketService.connect();
        setIsConnecting(false);
      } catch (error) {
        console.error("Connection error:", error);
        setIsConnecting(false);
        toast.error("Failed to connect to chat server");
      }
    }
  }, [isChatOpen, connected, isConnecting, socketService]);

  // Handle message updates
  useEffect(() => {
    if (isChatOpen && firebaseUser) {
      scrollToBottom();
    }
  }, [isChatOpen, currentMessages, scrollToBottom, firebaseUser]);

  // Handle unread counts
  useEffect(() => {
    if (isChatOpen && connected) {
      try {
        getUnreadCount();
      } catch (error) {
        console.error("Error getting unread count:", error);
      }
    }
  }, [isChatOpen, connected, getUnreadCount]);

  // Handle tab changes
  const handleTabChange = async tab => {
    setActiveChatTab(tab);
    setIsLoading(true);
    try {
      if (tab === "private") {
        markAllMessagesAsRead(selectedPrivateChatUser?.uid);
      }
      if (connected && firebaseUser) {
        if (tab === "public") {
          await requestPublicHistory();
        } else if (tab === "private" && selectedPrivateChatUser?.uid) {
          await requestPrivateHistory(selectedPrivateChatUser.uid);
        } else if (tab === "group" && selectedGroup?.id) {
          // Handle room history request
        }
      }
    } catch (error) {
      console.error("Error changing tab:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  // Message rendering function
  const renderMessages = column => {
    const messagesToRender =
      activeChatTab === "public"
        ? column === "left"
          ? currentMessages.left
          : currentMessages.right
        : currentMessages;

    return messagesToRender.map((message, index) => (
      <div
        key={message._id || message.id || index}
        className={`flex ${
          message.senderId === firebaseUser?.uid ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            message.senderId === firebaseUser?.uid
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-default)] text-[var(--text-primary)]"
          }`}
        >
          {message.senderId !== firebaseUser?.uid && (
            <div className="text-xs font-medium mb-1">{message.senderName || "Anonymous"}</div>
          )}
          <div className="break-words">{message.message || message.text}</div>
          <div className="text-xs mt-1 opacity-75">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    ));
  };

  // Message handling functions
  const handleUpdateMessage = async e => {
    e.preventDefault();
    if (!editText.trim() || !editingMessage) return;

    try {
      await editPrivateMessage({
        messageId: editingMessage.id,
        newText: editText.trim(),
      });
      setEditingMessage(null);
      setEditText("");
      toast.success("Message updated successfully");
    } catch (error) {
      toast.error("Failed to update message");
    }
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      if (activeChatTab === "private" && selectedPrivateChatUser) {
        await sendPrivateMessage({
          receiverId: selectedPrivateChatUser.uid,
          text: inputValue.trim(),
          type: "text",
        });
        toast.success(`Message sent to ${selectedPrivateChatUser.name}`);
      } else if (activeChatTab === "group" && selectedGroup) {
        await sendRoomMessage({
          roomId: selectedGroup.id,
          text: inputValue.trim(),
          type: "text",
        });
        toast.success(`Message sent to group: ${selectedGroup.name}`);
      } else {
        await sendPublicMessage({
          text: inputValue.trim(),
          type: "text",
        });
        toast.success("Message sent to public chat");
      }
      setInputValue("");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = e => {
    setInputValue(e.target.value);
    // Handle typing status
    if (!typingTimeoutRef.current) {
      sendTypingStatus(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Emoji selection handler
  const handleEmojiSelect = emojiData => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Message editing handlers
  const handleEditMessage = message => {
    setEditingMessage(message);
    setEditText(message.text);
    setInputValue(message.text);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
    setInputValue("");
  };

  const handleDeleteMessage = async messageId => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deletePrivateMessage(messageId);
        toast.success("Message deleted successfully");
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  // Guest registration handlers
  const handleGuestRegister = e => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    localStorage.setItem("guestName", guestName.trim());
    if (guestPhone.trim()) {
      localStorage.setItem("guestPhone", guestPhone.trim());
    }
    setIsGuestRegistered(true);
    toast.success("Guest registration successful!");
  };

  const handleDeleteGuest = () => {
    localStorage.removeItem("guestName");
    localStorage.removeItem("guestPhone");
    setGuestName("");
    setGuestPhone("");
    setIsGuestRegistered(false);
    toast.success("Guest registration removed");
  };

  // Handlers
  const handleSelectPrivateChat = user => {
    setSelectedPrivateChatUser(user);
    setActiveChatTab("private");
  };

  const handleSelectGroup = group => {
    setSelectedGroup(group);
    setActiveChatTab("group");
  };

  // Render chat content based on active tab
  const renderChatContent = () => {
    if (!connected) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] font-medium">Connecting to chat server...</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Please wait while we establish connection
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] font-medium">Loading messages...</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Fetching your conversation history
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Messages Container */}
        <div className="chat-messages-container p-4">
          {activeChatTab === "public" ? (
            <div className="flex flex-col space-y-4">{renderMessages()}</div>
          ) : (
            <div className="space-y-4">{renderMessages()}</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          {editingMessage ? (
            <form onSubmit={handleUpdateMessage} className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  placeholder="Edit your message..."
                  className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  rows="2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors"
                >
                  <FaCheck />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full p-2 pr-12 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  rows="2"
                  disabled={isSending}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors p-1"
                  >
                    <FaSmile />
                  </button>
                  <button
                    type="submit"
                    className={`p-1 rounded transition-colors ${
                      isSending || !inputValue.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] text-white"
                    }`}
                    disabled={isSending || !inputValue.trim()}
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <FaPaperPlane size={12} />
                    )}
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
              </div>
            </form>
          )}
          {typingUsers.length > 0 && (
            <div className="mt-2 text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}
        </div>
      </>
    );
  };

  // Render user list
  const renderUserList = () => (
    <div className="w-64 border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Online Users</h3>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {users.map(user => (
          <div
            key={user.uid}
            className={`p-3 cursor-pointer hover:bg-[var(--background-hover)] ${
              selectedPrivateChatUser?.uid === user.uid ? "bg-[var(--background-hover)]" : ""
            }`}
            onClick={() => {
              setSelectedPrivateChatUser(user);
              setActiveChatTab("private");
              markAllMessagesAsRead(user.uid);
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <FaUser className="w-8 h-8 text-[var(--text-secondary)]" />
                <FaCircle
                  className={`absolute bottom-0 right-0 w-3 h-3 ${
                    user.online ? "text-green-500" : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {user.role === "admin" ? "Admin" : "User"}
                </div>
              </div>
              {unreadCounts[user.uid] > 0 && (
                <div className="ml-auto bg-[var(--primary-main)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {unreadCounts[user.uid]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render group list
  const renderGroupList = () => (
    <div className="absolute right-0 top-0 h-full w-64 bg-[var(--background-paper)] border-l border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold mb-4">Groups</h3>
      <div className="space-y-2">
        {groups?.map(group => (
          <div
            key={group.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--background-default)] cursor-pointer"
            onClick={() => {
              setSelectedGroup(group);
              setActiveChatTab("group");
              setShowGroupList(false);
            }}
          >
            <div className="flex items-center space-x-2">
              <FaUsers className="text-[var(--primary-main)]" />
              <span>{group.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add these styles to your CSS or create a new style block
  const chatStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: var(--background-default);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--primary-main);
    }

    .message-container {
      position: relative;
      margin-bottom: 1rem;
    }

    .message-container:hover .message-actions {
      opacity: 1;
    }

    .chat-messages-container {
      max-height: calc(100% - 60px); /* Adjust based on your header/input heights */
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--border-color) var(--background-default);
    }

    .chat-input-container {
      position: sticky;
      bottom: 0;
      background: var(--background-paper);
      border-top: 1px solid var(--border-color);
      padding: 1rem;
    }
  `;

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[90vw] max-w-[350px] h-[80vh] max-h-[500px] bg-[var(--background-paper)] rounded-lg shadow-lg flex flex-col z-50 sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] overflow-hidden">
      <style>{chatStyles}</style>
      {/* Header */}
      <div className="p-2 sm:p-4 border-b flex items-center justify-between bg-[var(--primary-main)] text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold">Chat</h2>
          {connected ? (
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Online
            </span>
          ) : (
            <span className="text-xs bg-red-500 px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-[var(--primary-dark)] rounded transition-colors"
          >
            {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            onClick={onCloseChat}
            className="p-1 hover:bg-[var(--primary-dark)] rounded transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveChatTab("public")}
              className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
                activeChatTab === "public"
                  ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => setActiveChatTab("private")}
              className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
                activeChatTab === "private"
                  ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Private
            </button>
            <button
              onClick={() => setActiveChatTab("group")}
              className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
                activeChatTab === "group"
                  ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Group
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r overflow-y-auto custom-scrollbar">
              {activeChatTab === "private" && (
                <div className="p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  />
                </div>
              )}
              {activeChatTab === "group" && (
                <div className="p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search groups..."
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  />
                </div>
              )}
              <div className="divide-y">
                {activeChatTab === "private" &&
                  filteredUsers.map(user => (
                    <button
                      key={user.uid}
                      onClick={() => handleSelectPrivateChat(user)}
                      className={`w-full p-2 sm:p-3 text-left hover:bg-[var(--background-hover)] transition-colors ${
                        selectedPrivateChatUser?.uid === user.uid
                          ? "bg-[var(--primary-main)] text-white"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-base ${
                            selectedPrivateChatUser?.uid === user.uid
                              ? "bg-white text-[var(--primary-main)]"
                              : "bg-[var(--primary-main)]"
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm sm:text-base truncate ${
                              selectedPrivateChatUser?.uid === user.uid ? "text-white" : ""
                            }`}
                          >
                            {user.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selectedPrivateChatUser?.uid === user.uid
                                ? "text-white opacity-75"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {user.email}
                          </p>
                        </div>
                        {unreadCounts[user.uid] > 0 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              selectedPrivateChatUser?.uid === user.uid
                                ? "bg-white text-[var(--primary-main)]"
                                : "bg-[var(--primary-main)] text-white"
                            }`}
                          >
                            {unreadCounts[user.uid]}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                {activeChatTab === "group" &&
                  filteredGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => handleSelectGroup(group)}
                      className={`w-full p-2 sm:p-3 text-left hover:bg-[var(--background-hover)] transition-colors ${
                        selectedGroup?.id === group.id ? "bg-[var(--primary-main)] text-white" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-base ${
                            selectedGroup?.id === group.id
                              ? "bg-white text-[var(--primary-main)]"
                              : "bg-[var(--primary-main)]"
                          }`}
                        >
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm sm:text-base truncate ${
                              selectedGroup?.id === group.id ? "text-white" : ""
                            }`}
                          >
                            {group.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selectedGroup?.id === group.id
                                ? "text-white opacity-75"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {group.members.length} members
                          </p>
                        </div>
                        {unreadCounts[group.id] > 0 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              selectedGroup?.id === group.id
                                ? "bg-white text-[var(--primary-main)]"
                                : "bg-[var(--primary-main)] text-white"
                            }`}
                          >
                            {unreadCounts[group.id]}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar">{renderChatContent()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
