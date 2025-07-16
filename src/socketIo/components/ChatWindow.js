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
  FaChevronRight,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PrivateChatHistory from "./PrivateChatHistory";
import { ThemeContext } from "../../App";
import { theme } from "../../theme/theme";
import CreateGroupModal from "./ChatWindowComponents/CreateGroupModal";
import ChatHeader from "./ChatWindowComponents/ChatHeader";
import ChatTabs from "./ChatWindowComponents/ChatTabs";
import ChatSidebar from "./ChatWindowComponents/ChatSidebar";
import ChatArea from "./ChatWindowComponents/ChatArea";
import { useSocket } from "../SocketProvider";

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
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("public");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [fetchedHistories, setFetchedHistories] = useState(new Set());

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  // Filtered users and groups based on search
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    // De-duplicate users to prevent the same user from appearing multiple times in the list.
    // It creates a Map using a unique key (id or uid) to store only the last unique user object.
    const uniqueUsers = Array.from(
      new Map(users.map(user => [user.id || user.uid, user])).values()
    );

    return uniqueUsers.filter(
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
      // Sort private messages by timestamp ascending
      const msgs = privateMessages[selectedPrivateChatUser.uid] || [];
      return [...msgs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
    setActiveTab(tab);
    // History fetching is now handled by handleSelectPrivateChatUser
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

    return messagesToRender.map((message, index) => {
      // Improved sender matching for message sender name
      const senderUser = users.find(
        u =>
          u.uid === message.sender?.uid ||
          u.id === message.sender?.id ||
          u._id === message.sender?._id
      );
      const senderName = message.senderName || senderUser?.name || message.sender?.name || "User";
      const isCurrentUser =
        message.sender?.uid === currentUserId || message.senderId === currentUserId;
      // For private chat, always show sender info and time for each message
      const showSenderInfo =
        activeChatTab === "private"
          ? true
          : index === 0 || messagesToRender[index - 1].senderId !== message.senderId;
      // For Messenger style, show name only for other user, and only at the start of a group
      const showNameAbove =
        !isCurrentUser &&
        (index === 0 || messagesToRender[index - 1].senderId !== message.senderId);
      return (
        <div
          key={message._id || message.id || index}
          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} w-full`}
          style={{ marginTop: showNameAbove ? 16 : 6 }}
        >
          <div className="flex flex-col items-end max-w-full w-full">
            {/* Show sender name above bubble for other user at start of group */}
            {showNameAbove && (
              <div
                className="text-xs font-bold mb-1 ml-2"
                style={{ color: currentTheme.text.secondary, textAlign: "left" }}
              >
                {senderName}
              </div>
            )}
            <div
              className={`rounded-xl px-4 py-2 shadow-md break-words max-w-[80%] sm:max-w-[80%] w-fit ${
                isCurrentUser
                  ? "bg-[var(--primary-main)] text-white ml-auto"
                  : "bg-[var(--background-default)] text-[var(--text-primary)] mr-auto"
              }`}
              style={{
                marginLeft: isCurrentUser ? "auto" : 0,
                marginRight: isCurrentUser ? 0 : "auto",
                border: isCurrentUser
                  ? `2px solid ${currentTheme.primary.light}` // Vibrant border for own messages
                  : `1px solid ${currentTheme.border.main}`,
                maxWidth: window.innerWidth < 640 ? "90%" : "80%",
                minWidth: 40,
                fontSize: 15,
              }}
            >
              {message.message || message.text}
            </div>
            <div
              className={`text-xs mt-1 opacity-70 ${isCurrentUser ? "text-right" : "text-left"}`}
              style={{
                color: currentTheme.text.secondary,
                maxWidth: window.innerWidth < 640 ? "90%" : "80%",
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>
      );
    });
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
        sendPrivateMessage({
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
    if (!user) return;
    setSelectedPrivateChatUser(user);
    setActiveTab("private");

    // Fetch history only if it hasn't been fetched before for this user
    if (!fetchedHistories.has(user.uid)) {
      requestPrivateHistory(user.uid);
      setFetchedHistories(prev => new Set(prev).add(user.uid));
    }
  };

  const handleSelectGroup = group => {
    setSelectedGroup(group);
    setActiveTab("group");

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
  // THIS FUNCTION IS NOW MOVED TO ChatArea.js
  // const renderChatContent = () => { ... }

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
              setActiveTab("private");
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
              setActiveTab("group");
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

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleTextAreaClick = () => {
    // Hide sidebar on mobile when clicking text area
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  };

  // Delay chat window loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Load chat window after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until visible
  if (!isVisible) {
    return null;
  }

  if (!isChatOpen) return null;

  return (
    <div
      className="fixed bottom-4 right-4 w-[90vw] max-w-[350px] h-[80vh] max-h-[500px] rounded-lg shadow-lg flex flex-col z-50 sm:max-w-[560px] md:max-w-[630px] lg:max-w-[700px] lg:max-h-[700px] overflow-hidden"
      style={{
        background: currentTheme.background.paper,
        color: currentTheme.text.primary,
        border: `1px solid ${currentTheme.border.main}`,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{chatStyles}</style>
      {/* Header */}
      <ChatHeader
        connected={connected}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        toggleMinimize={toggleMinimize}
        isMinimized={isMinimized}
        onCloseChat={onCloseChat}
        currentTheme={currentTheme}
      />

      {!isMinimized && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <ChatTabs activeChatTab={activeTab} setActiveChatTab={setActiveTab} />

          {/* Chat Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            {isSidebarVisible && (
              <ChatSidebar
                activeChatTab={activeTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dbUser={dbUser}
                setShowCreateGroup={setShowCreateGroup}
                filteredGroups={filteredGroups}
                filteredUsers={filteredUsers}
                handleSelectPrivateChatUser={handleSelectPrivateChatUser}
                selectedPrivateChatUser={selectedPrivateChatUser}
                unreadCounts={unreadCounts}
                currentUserId={currentUserId}
                handleSelectGroup={handleSelectGroup}
                selectedGroup={selectedGroup}
                handleJoinGroup={handleJoinGroup}
                handleLeaveGroup={handleLeaveGroup}
                toggleSidebar={toggleSidebar}
              />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative">
              {/* Sidebar Toggle Button for Mobile */}
              {!isSidebarVisible && (
                <button
                  onClick={toggleSidebar}
                  className="absolute top-2 left-2 z-10 p-2 bg-[var(--primary-main)] text-white rounded-full shadow-lg md:hidden"
                  title="Show sidebar"
                >
                  <FaChevronRight />
                </button>
              )}

              <ChatArea
                connected={connected}
                isLoading={isLoading}
                activeChatTab={activeTab}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                currentTheme={currentTheme}
                currentMessages={currentMessages}
                messagesEndRef={messagesEndRef}
                editingMessage={editingMessage}
                handleUpdateMessage={handleUpdateMessage}
                editText={editText}
                setEditText={setEditText}
                handleCancelEdit={handleCancelEdit}
                handleSendMessage={handleSendMessage}
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                isSending={isSending}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                handleEmojiSelect={handleEmojiSelect}
                typingUsers={typingUsers}
                selectedPrivateChatUser={selectedPrivateChatUser}
                onTextAreaClick={handleTextAreaClick}
                users={users}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
        handleCreateGroup={handleCreateGroup}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        newGroupDescription={newGroupDescription}
        setNewGroupDescription={setNewGroupDescription}
        users={users}
        selectedUsersForGroup={selectedUsersForGroup}
        toggleUserSelection={toggleUserSelection}
        isCreatingGroup={isCreatingGroup}
      />
    </div>
  );
};

export default ChatWindow;
