import React, { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!user || !token) {
      setConnected(false);
      return;
    }

    try {
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
        setUsers(usersList);
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
        if (!history || history.length === 0) return;

        // Identify the chat partner from the first message
        const currentUserId = user.uid;
        const firstMsg = history[0];
        const partnerId =
          firstMsg.sender.uid === currentUserId ? firstMsg.receiverId : firstMsg.sender.uid;

        if (partnerId) {
          setPrivateMessages(prev => ({
            ...prev,
            [partnerId]: history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
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
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
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

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        setConnected(false);
      };
    } catch (error) {
      console.error("Socket initialization error:", error);
      setError(error);
      setConnected(false);
    }
  }, [user, token]);

  // Token expiration handling
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

  const sendPrivateMessage = ({ receiverId, text, type }) => {
    const message = {
      receiverId,
      text,
      type,
      sender: {
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
      timestamp: new Date().toISOString(),
    };
    socketService.sendPrivateMessage(message);
    setPrivateMessages(prev => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), message],
    }));
  };

  const value = {
    connected,
    users,
    messages,
    privateMessages,
    roomMessages,
    unreadCounts,
    typingUsers,
    activeRooms,
    groups,
    selectedGroup,
    setSelectedGroup,
    setGroups,
    error,
    sendPrivateMessage,
    sendRoomMessage: socketService.sendRoomMessage.bind(socketService),
    sendPublicMessage: socketService.sendPublicMessage.bind(socketService),
    requestPublicHistory: socketService.requestPublicHistory.bind(socketService),
    requestPrivateHistory: socketService.requestPrivateHistory.bind(socketService),
    requestGroupHistory: socketService.requestGroupHistory.bind(socketService),
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
    createGroup: socketService.createGroup.bind(socketService),
    joinGroup: socketService.joinGroup.bind(socketService),
    leaveGroup: socketService.leaveGroup.bind(socketService),
    getGroups: socketService.getGroups.bind(socketService),
    addUserToGroup: socketService.addUserToGroup.bind(socketService),
    removeUserFromGroup: socketService.removeUserFromGroup.bind(socketService),
    sendTypingStatus: socketService.sendTypingStatus.bind(socketService),
    markMessageAsRead: socketService.markMessageAsRead.bind(socketService),
    markAllMessagesAsRead: socketService.markAllMessagesAsRead.bind(socketService),
    markPrivateMessageAsRead: socketService.markPrivateMessageAsRead.bind(socketService),
    editPrivateMessage: socketService.editPrivateMessage.bind(socketService),
    deletePrivateMessage: socketService.deletePrivateMessage.bind(socketService),
    getUnreadCount: socketService.getUnreadCount.bind(socketService),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
