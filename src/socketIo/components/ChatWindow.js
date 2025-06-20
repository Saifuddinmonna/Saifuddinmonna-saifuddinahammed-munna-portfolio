import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
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
import { ThemeContext } from "../../App";
import { theme } from "../../theme/theme";

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
    requestGroupHistory,
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
    addUserToGroup,
    removeUserFromGroup,
    privateChats,
    getGroups,
    setGroups,
  } = useSocket();

  const { user: firebaseUser, dbUser } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get the correct user ID (use firebaseUid from MongoDB or fallback to Firebase UID)
  const currentUserId = dbUser?.firebaseUid || firebaseUser?.uid;

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
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

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

  // Load temporary groups from localStorage on mount
  useEffect(() => {
    if (activeChatTab === "group" && groups.length === 0) {
      const storedGroups = JSON.parse(localStorage.getItem("tempGroups") || "[]");
      if (storedGroups.length > 0) {
        setGroups(storedGroups);
      }
    }
  }, [activeChatTab, groups.length, setGroups]);

  // Handle connection status
  useEffect(() => {
    if (isChatOpen && !connected && !isConnecting) {
      setIsConnecting(true);
      try {
        getGroups();
        setIsConnecting(false);
      } catch (error) {
        console.error("Connection error:", error);
        setIsConnecting(false);
        toast.error("Failed to connect to chat server");
      }
    }
  }, [isChatOpen, connected, isConnecting, getGroups]);

  // Handle message updates
  useEffect(() => {
    if (isChatOpen && dbUser) {
      scrollToBottom();
    }
  }, [isChatOpen, currentMessages, scrollToBottom, dbUser]);

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
        markAllMessagesAsRead(selectedPrivateChatUser?.id);
      }
      if (connected && dbUser) {
        if (tab === "public") {
          await requestPublicHistory();
        } else if (tab === "private" && selectedPrivateChatUser?.id) {
          await requestPrivateHistory(selectedPrivateChatUser.id);
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

    if (!messagesToRender || messagesToRender.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-[var(--text-secondary)]">
          <div className="text-center">
            <FaUsers className="mx-auto mb-2 text-2xl opacity-50" />
            <p className="text-sm">
              {activeChatTab === "group" && selectedGroup
                ? `No messages in ${selectedGroup.name} yet`
                : activeChatTab === "private" && selectedPrivateChatUser
                ? `No messages with ${selectedPrivateChatUser.name} yet`
                : "No messages yet"}
            </p>
            <p className="text-xs mt-1 opacity-75">Start a conversation!</p>
          </div>
        </div>
      );
    }

    return messagesToRender.map((message, index) => (
      <div
        key={message._id || message.id || index}
        className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            message.senderId === currentUserId
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-default)] text-[var(--text-primary)]"
          }`}
        >
          {message.senderId !== currentUserId && (
            <div className="text-xs font-medium mb-1 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--primary-main)] flex items-center justify-center text-white text-xs">
                {(message.senderName || "A").charAt(0).toUpperCase()}
              </span>
              {message.senderName || "Anonymous"}
              {activeChatTab === "group" && <span className="text-xs opacity-75">• Group</span>}
            </div>
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
        toast.success(`Message sent to ${selectedGroup.name}`);
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
  const handleSelectPrivateChatUser = user => {
    setSelectedPrivateChatUser(user);
    setActiveChatTab("private");
  };

  const handleSelectGroup = group => {
    setSelectedGroup(group);
    setActiveChatTab("group");

    // Load group message history
    if (connected && group?.id) {
      try {
        // Request group message history
        requestGroupHistory(group.id);
      } catch (error) {
        console.error("Error loading group history:", error);
      }
    }
  };

  // Group management functions
  const handleCreateGroup = async e => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    setIsCreatingGroup(true);
    try {
      // Create a temporary group object for UI
      const tempGroup = {
        id: Date.now().toString(), // Temporary ID
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        createdBy: currentUserId,
        creatorName: dbUser?.name || dbUser?.data?.email,
        members: [
          {
            id: currentUserId,
            name: dbUser?.data?.name || dbUser?.data?.email,
            email: dbUser?.data?.email,
            role: "admin",
          },
          ...selectedUsersForGroup.map(userId => {
            const user = users.find(u => u.id === userId);
            return {
              id: userId,
              name: user?.name || "User",
              email: user?.email || "user@example.com",
              role: "member",
            };
          }),
        ],
        admins: [
          {
            id: currentUserId,
            name: dbUser?.data?.name || dbUser?.data?.email,
            email: dbUser?.data?.email,
          },
        ],
      };

      // Add to groups list immediately for UI
      setGroups(prev => [...prev, tempGroup]);

      // Store in localStorage for persistence
      const storedGroups = JSON.parse(localStorage.getItem("tempGroups") || "[]");
      storedGroups.push(tempGroup);
      localStorage.setItem("tempGroups", JSON.stringify(storedGroups));

      // Call the actual createGroup function (when server is ready)
      await createGroup({
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        createdBy: currentUserId,
        members: selectedUsersForGroup,
      });

      setShowCreateGroup(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedUsersForGroup([]);
      toast.success("Group created successfully!");

      // Force refresh groups list after a delay to get server data
      setTimeout(() => {
        getGroups();
      }, 1000);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async groupId => {
    try {
      await joinGroup(groupId);
      toast.success("Joined group successfully!");
    } catch (error) {
      toast.error("Failed to join group");
    }
  };

  const handleLeaveGroup = async groupId => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      try {
        await leaveGroup(groupId);
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(null);
        }
        toast.success("Left group successfully!");
      } catch (error) {
        toast.error("Failed to leave group");
      }
    }
  };

  const handleAddUserToGroup = async (groupId, userId) => {
    try {
      await addUserToGroup(groupId, userId);
      toast.success("User added to group successfully!");
    } catch (error) {
      toast.error("Failed to add user to group");
    }
  };

  const handleRemoveUserFromGroup = async (groupId, userId) => {
    if (window.confirm("Are you sure you want to remove this user from the group?")) {
      try {
        await removeUserFromGroup(groupId, userId);
        toast.success("User removed from group successfully!");
      } catch (error) {
        toast.error("Failed to remove user from group");
      }
    }
  };

  const toggleUserSelection = userId => {
    setSelectedUsersForGroup(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
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
        {/* Chat Header */}
        {activeChatTab === "group" && selectedGroup && (
          <div className="p-3 border-b bg-[var(--background-default)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-main)] flex items-center justify-center text-white text-sm font-semibold">
                {selectedGroup.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{selectedGroup.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {selectedGroup.members?.length || 0} members
                  {selectedGroup.description && (
                    <span className="ml-2">• {selectedGroup.description}</span>
                  )}
                </p>
                {selectedGroup.creatorName && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Created by {selectedGroup.creatorName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Back to groups"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

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
                  placeholder={
                    activeChatTab === "private" && selectedPrivateChatUser
                      ? `Message ${selectedPrivateChatUser.name}...`
                      : activeChatTab === "group" && selectedGroup
                      ? `Message ${selectedGroup.name}...`
                      : "Type a message..."
                  }
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
            key={user.id}
            className={`p-3 cursor-pointer hover:bg-[var(--background-hover)] ${
              selectedPrivateChatUser?.id === user.id ? "bg-[var(--background-hover)]" : ""
            }`}
            onClick={() => {
              setSelectedPrivateChatUser(user);
              setActiveChatTab("private");
              markAllMessagesAsRead(user.id);
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
              {unreadCounts[user.id] > 0 && (
                <div className="ml-auto bg-[var(--primary-main)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {unreadCounts[user.id]}
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
    <div
      className="fixed bottom-4 right-4 w-[90vw] max-w-[350px] h-[80vh] max-h-[500px] rounded-lg shadow-lg flex flex-col z-50 sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] overflow-hidden"
      style={{
        background: currentTheme.background.paper,
        color: currentTheme.text.primary,
        border: `1px solid ${currentTheme.border.main}`,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{chatStyles}</style>
      {/* Header */}
      <div
        className="p-2 sm:p-4 border-b flex items-center justify-between rounded-t-lg"
        style={{
          background: currentTheme.primary.main,
          color: currentTheme.text.primary,
          borderBottom: `1px solid ${currentTheme.border.main}`,
        }}
      >
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
            onClick={toggleTheme}
            className="p-1 rounded transition-colors border"
            style={{
              background: isDarkMode
                ? currentTheme.background.default
                : currentTheme.background.paper,
              color: currentTheme.text.primary,
              borderColor: currentTheme.border.main,
            }}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
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
                  <div className="flex items-center gap-2 mb-2">
                    <FaUsers className="text-[var(--primary-main)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">Groups</span>
                    {dbUser?.data?.role === "admin" && (
                      <span className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                    {/* Debug info */}
                    <span className="text-xs text-gray-500">
                      Role: {dbUser?.data?.role || "none"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search groups..."
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  />
                  {/* Show create button for admin OR for testing - remove the role check temporarily */}
                  {(dbUser?.data?.role === "admin" || true) && (
                    <button
                      onClick={() => setShowCreateGroup(true)}
                      className="w-full mt-2 p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <FaUsers />
                      Create New Group
                    </button>
                  )}
                  <div className="mt-2 text-xs text-[var(--text-secondary)]">
                    {filteredGroups.length} group{filteredGroups.length !== 1 ? "s" : ""} available
                  </div>
                </div>
              )}
              <div className="divide-y">
                {activeChatTab === "private" &&
                  filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectPrivateChatUser(user)}
                      className={`w-full p-3 text-left hover:bg-[var(--background-hover)] transition-colors border-b border-[var(--border-main)] ${
                        selectedPrivateChatUser?.id === user.id
                          ? "bg-[var(--primary-main)] text-white"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                            selectedPrivateChatUser?.id === user.id
                              ? "bg-white text-[var(--primary-main)]"
                              : "bg-[var(--primary-main)]"
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm truncate ${
                              selectedPrivateChatUser?.id === user.id ? "text-white" : ""
                            }`}
                          >
                            {user.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selectedPrivateChatUser?.id === user.id
                                ? "text-white opacity-75"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {user.email}
                          </p>
                        </div>
                        {unreadCounts[user.id] > 0 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              selectedPrivateChatUser?.id === user.id
                                ? "bg-white text-[var(--primary-main)]"
                                : "bg-[var(--primary-main)] text-white"
                            }`}
                          >
                            {unreadCounts[user.id]}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                {activeChatTab === "group" && (
                  <>
                    {filteredGroups.length === 0 ? (
                      <div className="p-4 text-center text-[var(--text-secondary)]">
                        <FaUsers className="mx-auto mb-2 text-2xl opacity-50" />
                        <p className="text-sm">No groups available</p>
                        {dbUser?.data?.role === "admin" && (
                          <p className="text-xs mt-1">Create a group to get started</p>
                        )}
                        {dbUser?.data?.role !== "admin" && (
                          <p className="text-xs mt-1">Ask an admin to create a group</p>
                        )}
                        <p className="text-xs mt-2 opacity-75">
                          Groups will appear here once created
                        </p>
                        <p className="text-xs mt-1 opacity-50">
                          You can join groups to start chatting with members
                        </p>
                      </div>
                    ) : (
                      filteredGroups.map(group => {
                        const isMember = group.members?.some(member => member.id === currentUserId);
                        const isAdmin = dbUser?.data?.role === "admin";
                        const isCreator = group.createdBy === currentUserId;
                        const memberCount = group.members?.length || 0;

                        return (
                          <div
                            key={group.id}
                            className={`w-full p-3 text-left hover:bg-[var(--background-hover)] transition-colors border-b border-[var(--border-main)] cursor-pointer ${
                              selectedGroup?.id === group.id
                                ? "bg-[var(--primary-main)] text-white"
                                : ""
                            }`}
                            onClick={() => {
                              if (isMember) {
                                handleSelectGroup(group);
                              } else {
                                // If not a member, show a message to join first
                                toast.error("Please join the group first to chat");
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                                  selectedGroup?.id === group.id
                                    ? "bg-white text-[var(--primary-main)]"
                                    : "bg-[var(--primary-main)]"
                                }`}
                              >
                                {group.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p
                                    className={`font-semibold text-sm truncate ${
                                      selectedGroup?.id === group.id ? "text-white" : ""
                                    }`}
                                  >
                                    {group.name}
                                  </p>
                                  {isCreator && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        selectedGroup?.id === group.id
                                          ? "bg-white text-[var(--primary-main)]"
                                          : "bg-[var(--primary-main)] text-white"
                                      }`}
                                    >
                                      Creator
                                    </span>
                                  )}
                                  {isMember && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        selectedGroup?.id === group.id
                                          ? "bg-white text-[var(--primary-main)]"
                                          : "bg-green-500 text-white"
                                      }`}
                                    >
                                      Member
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-xs mb-1 ${
                                    selectedGroup?.id === group.id
                                      ? "text-white opacity-75"
                                      : "text-[var(--text-secondary)]"
                                  }`}
                                >
                                  <span className="font-medium">{memberCount}</span> member
                                  {memberCount !== 1 ? "s" : ""}
                                  {isMember && (
                                    <span className="ml-2 text-green-500">• Joined</span>
                                  )}
                                </p>
                                {group.description && (
                                  <p
                                    className={`text-xs truncate mb-2 ${
                                      selectedGroup?.id === group.id
                                        ? "text-white opacity-75"
                                        : "text-[var(--text-secondary)]"
                                    }`}
                                  >
                                    {group.description}
                                  </p>
                                )}
                                {group.creatorName && (
                                  <p
                                    className={`text-xs ${
                                      selectedGroup?.id === group.id
                                        ? "text-white opacity-75"
                                        : "text-[var(--text-secondary)]"
                                    }`}
                                  >
                                    Created by {group.creatorName}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                {unreadCounts[group.id] > 0 && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      selectedGroup?.id === group.id
                                        ? "bg-white text-[var(--primary-main)]"
                                        : "bg-red-500 text-white"
                                    }`}
                                  >
                                    {unreadCounts[group.id]}
                                  </span>
                                )}
                                <div className="flex gap-1">
                                  {!isMember ? (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleJoinGroup(group.id);
                                      }}
                                      className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
                                    >
                                      Join
                                    </button>
                                  ) : (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleLeaveGroup(group.id);
                                      }}
                                      className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                                    >
                                      Leave
                                    </button>
                                  )}
                                  {isMember && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleSelectGroup(group);
                                      }}
                                      className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                                        selectedGroup?.id === group.id
                                          ? "bg-white text-[var(--primary-main)]"
                                          : "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                                      }`}
                                    >
                                      Chat
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar">{renderChatContent()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background-paper)] rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Group</h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  required
                  maxLength={100}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {newGroupName.length}/100 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Description
                </label>
                <textarea
                  value={newGroupDescription}
                  onChange={e => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  rows="3"
                  maxLength={500}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {newGroupDescription.length}/500 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Add Members ({selectedUsersForGroup.length} selected)
                </label>
                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-[var(--background-default)]">
                  {users.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)] text-center py-2">
                      No users available
                    </p>
                  ) : (
                    users.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 p-1 hover:bg-[var(--background-hover)] rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsersForGroup.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded text-[var(--primary-main)] focus:ring-[var(--primary-main)]"
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--primary-main)] flex items-center justify-center text-white text-xs">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm text-[var(--text-primary)] font-medium">
                              {user.name}
                            </span>
                            <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {selectedUsersForGroup.length > 0 && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Selected: {selectedUsersForGroup.length} user
                    {selectedUsersForGroup.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2"
                  disabled={!newGroupName.trim() || isCreatingGroup}
                >
                  {isCreatingGroup ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaUsers />
                      Create Group
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
