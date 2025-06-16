import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import { useAuth } from "../auth/context/AuthContext"; // To get the user token for authentication

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { token, dbUser, loading } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]); // State to store list of active users
  const [typingUsers, setTypingUsers] = useState(new Set()); // State to store users who are typing
  const [messages, setMessages] = useState([]); // State to store all chat messages
  const [currentRoom, setCurrentRoom] = useState("general"); // Default to 'general' for public chat
  const [hasUnreadPrivateMessages, setHasUnreadPrivateMessages] = useState(false); // New state for unread private messages
  const [groups, setGroups] = useState([]); // State to store chat groups
  const [selectedGroup, setSelectedGroup] = useState(null); // State to store the currently selected group
  const [privateChats, setPrivateChats] = useState({}); // New state for private chat history
  const [privateMessages, setPrivateMessages] = useState({});

  useEffect(() => {
    if (loading) return; // Wait for auth loading to complete

    // Set auth token for socket connection
    if (token) {
      socket.auth = { token };
    } else {
      // For guest users, or if token is not available yet
      // No specific auth needed for guest to connect initially, but we'll handle their ID later
      socket.auth = {};
    }

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected!");

      // Emit userJoin event after successful connection
      if (dbUser && token) {
        // Registered user
        socket.emit("userJoin", {
          token: token,
          avatar: dbUser.photoURL || null, // Assuming dbUser has photoURL
        });
        socket.emit("requestGroupList"); // Request initial group list on connect
        // Request private message history for all chats
        socket.emit("requestAllPrivateHistory");
      }
      // For guest users, the `userJoin` will be emitted from ChatWindow after they input details
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected!");
      setUsers([]); // Clear users on disconnect
      setTypingUsers(new Set()); // Clear typing users on disconnect
    };

    const onConnectError = error => {
      console.error("Socket connection error from provider:", error);
    };

    const onUsersList = usersList => {
      console.log("Current users list:", usersList);
      setUsers(usersList);
    };

    const onUserJoined = data => {
      console.log("New user joined:", data);
      // Server will send updated usersList, so just rely on that or add user directly
      // For now, rely on `usersList` event being sent after join
    };

    const onUserLeft = data => {
      console.log("User left:", data);
      // Server will send updated usersList, so just rely on that or remove user directly
      // For now, rely on `usersList` event being sent after leave
    };

    const onUserTyping = ({ userId, userName, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userName);
        } else {
          newSet.delete(userName);
        }
        return newSet;
      });
    };

    const onPublicMessage = msg => {
      console.log("Received public message:", msg);
      setMessages(prev => [...prev, { ...msg, type: "public" }]);
    };

    const onPrivateMessage = msg => {
      console.log("Received private message:", msg);
      const messageWithType = { ...msg, type: "private" };

      // Update private messages state
      setPrivateMessages(prev => {
        const chatId =
          msg.senderId === (dbUser?.firebaseUid || socket.id) ? msg.receiverId : msg.senderId;

        return {
          ...prev,
          [chatId]: [...(prev[chatId] || []), messageWithType],
        };
      });

      // Set unread flag if the message is for the current user
      if (msg.receiverId === (dbUser?.firebaseUid || socket.id)) {
        setHasUnreadPrivateMessages(true);
      }
    };

    const onRoomMessage = msg => {
      console.log("Received room message:", msg);
      setMessages(prev => [...prev, { ...msg, type: "room" }]);
    };

    const onBroadcastMessage = msg => {
      console.log("Received broadcast message:", msg);
      setMessages(prev => [...prev, { ...msg, type: "broadcast" }]);
    };

    const onGroupList = groupList => {
      console.log("Received group list:", groupList);
      setGroups(groupList);
    };

    const onGroupCreated = group => {
      console.log("Group created:", group);
      setGroups(prev => [...prev, group]);
    };

    const onGroupJoined = ({ groupId, userId }) => {
      console.log(`${userId} joined group ${groupId}`);
      // Server should send updated group list or message, for now, just log
    };

    const onGroupLeft = ({ groupId, userId }) => {
      console.log(`${userId} left group ${groupId}`);
      // Server should send updated group list or message, for now, just log
    };

    const onPublicMessageHistory = history => {
      console.log("Received public message history:", history);
      setMessages(prev => {
        const newMessages = history.map(msg => ({ ...msg, type: "public" }));
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMessages]; // Append history as it's typically fetched when the tab opens
      });
    };

    const onPrivateMessageHistory = history => {
      console.log("Received private message history:", history);

      // Group messages by chat
      const groupedMessages = history.reduce((acc, msg) => {
        const chatId =
          msg.senderId === (dbUser?.firebaseUid || socket.id) ? msg.receiverId : msg.senderId;

        if (!acc[chatId]) {
          acc[chatId] = [];
        }
        acc[chatId].push({ ...msg, type: "private" });
        return acc;
      }, {});

      setPrivateMessages(prev => ({
        ...prev,
        ...groupedMessages,
      }));
    };

    const onRoomMessageHistory = history => {
      console.log("Received room message history:", history);
      setMessages(prev => {
        const newMessages = history.map(msg => ({ ...msg, type: "room" }));
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMessages];
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("usersList", onUsersList);
    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("userTyping", onUserTyping);
    socket.on("publicMessage", onPublicMessage);
    socket.on("privateMessage", onPrivateMessage);
    socket.on("roomMessage", onRoomMessage);
    socket.on("broadcastMessage", onBroadcastMessage);
    socket.on("groupList", onGroupList);
    socket.on("groupCreated", onGroupCreated);
    socket.on("groupJoined", onGroupJoined);
    socket.on("groupLeft", onGroupLeft);
    socket.on("publicMessageHistory", onPublicMessageHistory);
    socket.on("privateMessageHistory", onPrivateMessageHistory);
    socket.on("roomMessageHistory", onRoomMessageHistory);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("usersList", onUsersList);
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("userTyping", onUserTyping);
      socket.off("publicMessage", onPublicMessage);
      socket.off("privateMessage", onPrivateMessage);
      socket.off("roomMessage", onRoomMessage);
      socket.off("broadcastMessage", onBroadcastMessage);
      socket.off("groupList", onGroupList);
      socket.off("groupCreated", onGroupCreated);
      socket.off("groupJoined", onGroupJoined);
      socket.off("groupLeft", onGroupLeft);
      socket.off("publicMessageHistory", onPublicMessageHistory);
      socket.off("privateMessageHistory", onPrivateMessageHistory);
      socket.off("roomMessageHistory", onRoomMessageHistory);
      socket.disconnect(); // Disconnect when component unmounts
    };
  }, [token, dbUser, loading]); // Added dbUser to dependencies

  // Function for guest users to join, called from ChatWindow
  const joinAsGuest = (guestName, phone = null) => {
    socket.emit("userJoin", {
      guestName: guestName,
      phone: phone,
    });
  };

  // New functions for group management
  const createGroup = groupName => {
    socket.emit("createGroup", { name: groupName });
  };

  const joinGroup = groupId => {
    socket.emit("joinGroup", { groupId });
  };

  const leaveGroup = groupId => {
    socket.emit("leaveGroup", { groupId });
  };

  const value = {
    socket,
    isConnected,
    dbUser, // Provide dbUser from AuthContext for role-based UI
    users,
    typingUsers,
    messages, // Expose messages state
    currentRoom, // Expose currentRoom state
    joinAsGuest,
    hasUnreadPrivateMessages, // Expose unread private messages flag
    setHasUnreadPrivateMessages, // Expose setter to clear flag
    groups, // Expose groups state
    selectedGroup, // Expose selectedGroup state
    setSelectedGroup, // Expose setter for selectedGroup
    createGroup, // Expose createGroup function
    joinGroup, // Expose joinGroup function
    leaveGroup, // Expose leaveGroup function
    privateChats, // Expose private chats state
    privateMessages,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
