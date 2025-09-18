import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/context/AuthContext";
import { socketService } from "./socket";
import { toast } from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [roomMessages, setRoomMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [activeRooms, setActiveRooms] = useState(new Set());
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState(null);

  // Lazy initialize socket connection - DISABLED FOR PERFORMANCE
  const initializeSocket = useCallback(async () => {
    // SOCKET.IO DISABLED FOR PERFORMANCE - PREVENTING WEBSOCKET CONNECTION ERRORS
    console.log("Socket.IO initialization disabled for performance");
    return;

    /*
    if (!user || !token || isInitialized) {
      return;
    }

    try {
      console.log("Initializing socket connection...");

      // Initialize socket connection
      socketService.connect(token);

      // Set up event listeners
      socketService.onUserJoined(data => {
        setUsers(prev => [...prev, data.user]);
      });

      socketService.onUserLeft(data => {
        setUsers(prev => prev.filter(u => u.id !== data.user.id));
      });

      socketService.onUsersList(usersList => {
        // Deduplicate users to prevent same user appearing multiple times
        const userMap = new Map();

        usersList.forEach(user => {
          // Use email or name as primary unique identifier to prevent duplicates from multiple browser sessions
          const uniqueKey =
            user.email?.toLowerCase() ||
            user.name?.toLowerCase() ||
            user.id ||
            user.uid ||
            user._id;

          if (uniqueKey) {
            // If user already exists, keep the one with more complete data
            const existingUser = userMap.get(uniqueKey);
            if (
              !existingUser ||
              (user.name && !existingUser.name) ||
              (user.email && !existingUser.email) ||
              (user.role && !existingUser.role)
            ) {
              userMap.set(uniqueKey, user);
            }
          }
        });

        const deduplicatedUsers = Array.from(userMap.values());
        console.log("Deduplicated users:", deduplicatedUsers.length, "from", usersList.length);
        setUsers(deduplicatedUsers);
      });

      socketService.onMessage(message => {
        console.log("Received public message:", message);
        setMessages(prev => [...prev, message]);
      });

      socketService.onPrivateMessage(message => {
        console.log("Received private message:", message);
        const chatPartnerId = message.sender.uid;
        setPrivateMessages(prev => ({
          ...prev,
          [chatPartnerId]: [...(prev[chatPartnerId] || []), message],
        }));
      });

      socketService.onRoomMessage(message => {
        console.log("Received room message:", message);
        setRoomMessages(prev => ({
          ...prev,
          [message.roomId]: [...(prev[message.roomId] || []), message],
        }));
      });

      socketService.onMessageHistory(history => {
        console.log("Received message history:", history);
        setMessages(history);
      });

      socketService.onPrivateMessageHistory(history => {
        console.log("Received private message history:", history);
        if (!history || history.length === 0) return;

        // Identify the chat partner from the first message
        const currentUserId = user.uid;
        const firstMsg = history[0];

        // Improved partnerId resolution with fallbacks
        const partnerId =
          firstMsg.sender?.uid === currentUserId
            ? firstMsg.receiverId || firstMsg.receiver?.uid || firstMsg.receiverId
            : firstMsg.sender?.uid || firstMsg.senderId;

        console.log("Partner ID resolved:", partnerId, "from message:", firstMsg);

        if (partnerId) {
          const formattedHistory = history.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
            senderName: msg.senderName || msg.sender?.name || "Unknown",
            senderId: msg.senderId || msg.sender?.uid || "unknown",
          }));

          setPrivateMessages(prev => ({
            ...prev,
            [partnerId]: formattedHistory.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
          }));
        }
      });

      socketService.onRoomMessageHistory(history => {
        const messagesByRoom = history.reduce((acc, message) => {
          const roomId = message.roomId;
          if (!acc[roomId]) {
            acc[roomId] = [];
          }
          acc[roomId].push(message);
          return acc;
        }, {});
        setRoomMessages(messagesByRoom);
      });

      // Group event listeners
      socketService.onGroupsList(groupsList => {
        setGroups(groupsList);
      });

      socketService.onGroupCreated(group => {
        setGroups(prev => [...prev, group]);
        toast.success(`Group "${group.name}" created successfully!`);
      });

      socketService.onGroupJoined(data => {
        setGroups(prev =>
          prev.map(group =>
            group.id === data.groupId ? { ...group, members: [...group.members, data.user] } : group
          )
        );
        toast.success(`Joined group "${data.groupName}"!`);
      });

      socketService.onGroupLeft(data => {
        setGroups(prev =>
          prev.map(group =>
            group.id === data.groupId
              ? { ...group, members: group.members.filter(member => member.id !== data.userId) }
              : group
          )
        );
        toast.success(`Left group "${data.groupName}"!`);
      });

      socketService.onUserAddedToGroup(data => {
        setGroups(prev =>
          prev.map(group =>
            group.id === data.groupId ? { ...group, members: [...group.members, data.user] } : group
          )
        );
        toast.success(`${data.user.name} added to group "${data.groupName}"!`);
      });

      socketService.onUserRemovedFromGroup(data => {
        setGroups(prev =>
          prev.map(group =>
            group.id === data.groupId
              ? { ...group, members: group.members.filter(member => member.id !== data.userId) }
              : group
          )
        );
        toast.success(`${data.userName} removed from group "${data.groupName}"!`);
      });

      socketService.onUserTyping(data => {
        console.log("Received typing status:", data);

        // Only process typing status if it's from a different user
        if (data.userId === user.uid) {
          return; // Ignore own typing status
        }

        // Handle typing status based on context
        if (data.type === "private" && data.receiverId) {
          // For private chat, only show typing if it's from the selected user
          if (data.receiverId === user.uid) {
            setTypingUsers(prev => ({
              ...prev,
              [data.userId]: data.isTyping,
            }));
          }
        } else if (data.type === "group" && data.roomId) {
          // For group chat, show typing from all group members
          setTypingUsers(prev => ({
            ...prev,
            [data.userId]: data.isTyping,
          }));
        } else if (data.type === "public") {
          // For public chat, show typing from all users
          setTypingUsers(prev => ({
            ...prev,
            [data.userId]: data.isTyping,
          }));
        } else {
          // Fallback for backward compatibility
          setTypingUsers(prev => ({
            ...prev,
            [data.userId]: data.isTyping,
          }));
        }

        // Auto-clear typing status after 3 seconds if user stops typing
        if (data.isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => {
              const newState = { ...prev };
              if (newState[data.userId] === true) {
                delete newState[data.userId];
              }
              return newState;
            });
          }, 3000);
        } else {
          // Immediately clear typing status when user stops typing
          setTypingUsers(prev => {
            const newState = { ...prev };
            delete newState[data.userId];
            return newState;
          });
        }
      });

      socketService.onUnreadCounts(counts => {
        setUnreadCounts(counts);
      });

      socketService.onError(error => {
        setError(error);
        console.error("Socket error:", error);
      });

      // Join chat
      socketService.joinChat({
        token,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });

      // Get groups
      socketService.getGroups();

      setConnected(true);
      setIsInitialized(true);
      console.log("Socket connection initialized successfully");
    } catch (error) {
      console.error("Socket initialization error:", error);
      setError(error);
      setConnected(false);
    }
    */
  }, [user, token, isInitialized]);

  // Initialize socket after page load - DISABLED FOR PERFORMANCE
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSocket();
    }, 2000); // Delay socket initialization by 2 seconds

    return () => clearTimeout(timer);
  }, [initializeSocket]);
  */

  // Cleanup on unmount - DISABLED FOR PERFORMANCE
  /*
  useEffect(() => {
    return () => {
      if (isInitialized) {
        socketService.disconnect();
        setConnected(false);
        setIsInitialized(false);
      }
    };
  }, [isInitialized]);
  */

  // Token expiration handling - DISABLED FOR PERFORMANCE
  /*
  useEffect(() => {
    const handleTokenExpiring = event => {
      // Handle token expiration
      console.log("Token expiring:", event.detail);
      // You can implement your token refresh logic here
    };

    window.addEventListener("tokenExpiring", handleTokenExpiring);
    return () => {
      window.removeEventListener("tokenExpiring", handleTokenExpiring);
    };
  }, []);
  */

  const sendPrivateMessage = ({ receiverId, text, type, sender, timestamp }) => {
    // SOCKET.IO DISABLED FOR PERFORMANCE
    console.log("Socket.IO messaging disabled for performance");
    return;

    /*
    const message = {
      receiverId,
      text,
      type,
      sender: sender || {
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
      timestamp: timestamp || new Date().toISOString(),
    };

    console.log("Sending private message:", message);
    socketService.sendPrivateMessage(message);

    // Add to local state for immediate UI update
    setPrivateMessages(prev => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), message],
    }));
    */
  };

  const value = {
    connected: false, // DISABLED FOR PERFORMANCE
    users: [],
    messages: [],
    privateMessages: {},
    roomMessages: {},
    unreadCounts: {},
    typingUsers: {},
    activeRooms: new Set(),
    groups: [],
    selectedGroup: null,
    setSelectedGroup,
    setGroups,
    error: null,
    sendPrivateMessage,
    // SOCKET.IO METHODS DISABLED FOR PERFORMANCE
    sendRoomMessage: () => console.log("Socket.IO disabled for performance"),
    sendPublicMessage: () => console.log("Socket.IO disabled for performance"),
    requestPublicHistory: () => console.log("Socket.IO disabled for performance"),
    requestPrivateHistory: () => console.log("Socket.IO disabled for performance"),
    requestGroupHistory: () => console.log("Socket.IO disabled for performance"),
    joinRoom: () => console.log("Socket.IO disabled for performance"),
    leaveRoom: () => console.log("Socket.IO disabled for performance"),
    createGroup: () => console.log("Socket.IO disabled for performance"),
    joinGroup: () => console.log("Socket.IO disabled for performance"),
    leaveGroup: () => console.log("Socket.IO disabled for performance"),
    getGroups: () => console.log("Socket.IO disabled for performance"),
    addUserToGroup: () => console.log("Socket.IO disabled for performance"),
    removeUserFromGroup: () => console.log("Socket.IO disabled for performance"),
    sendTypingStatus: () => console.log("Socket.IO disabled for performance"),
    markMessageAsRead: () => console.log("Socket.IO disabled for performance"),
    markAllMessagesAsRead: () => console.log("Socket.IO disabled for performance"),
    markPrivateMessageAsRead: () => console.log("Socket.IO disabled for performance"),
    editPrivateMessage: () => console.log("Socket.IO disabled for performance"),
    deletePrivateMessage: () => console.log("Socket.IO disabled for performance"),
    getUnreadCount: () => console.log("Socket.IO disabled for performance"),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
