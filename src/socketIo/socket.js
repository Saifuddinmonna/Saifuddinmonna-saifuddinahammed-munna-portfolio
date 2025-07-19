import { io } from "socket.io-client";
import { BASE_API_URL } from "../utils/apiConfig";

const SOCKET_URL = BASE_API_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.initialized = false;
    this.lastTypingStatus = {}; // Added to track last sent typing status
  }

  connect(token) {
    if (!token) {
      console.error("No token provided for socket connection");
      return;
    }

    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    try {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      this.initialized = true;
      this.setupEventListeners();
      console.log("Socket connection initialized");
    } catch (error) {
      console.error("Socket connection error:", error);
      this.initialized = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.initialized = false;
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    this.socket.on("error", error => {
      console.error("Socket error:", error);
    });

    this.socket.on("tokenExpiring", data => {
      console.log("Token expiring:", data);
      window.dispatchEvent(new CustomEvent("tokenExpiring", { detail: data }));
    });
  }

  // User management
  joinChat(userData) {
    if (!this.socket) return;
    this.socket.emit("userJoin", userData);
  }

  refreshToken(newToken) {
    if (!this.socket) return;
    this.socket.emit("refreshToken", newToken);
  }

  // Message handling
  sendPrivateMessage(messageData) {
    if (!this.initialized || !this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.emit("privateMessage", messageData);
  }

  sendRoomMessage(messageData) {
    if (!this.initialized || !this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.emit("roomMessage", messageData);
  }

  sendPublicMessage(messageData) {
    if (!this.initialized || !this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.emit("publicMessage", messageData);
  }

  // Message history
  requestPublicHistory() {
    if (!this.socket) return;
    this.socket.emit("requestPublicHistory");
  }

  requestPrivateHistory(userId) {
    if (!this.socket) return;
    this.socket.emit("requestPrivateHistory", { userId });
  }

  requestGroupHistory(groupId) {
    if (!this.socket) return;
    this.socket.emit("requestGroupHistory", { groupId });
  }

  // Room management
  joinRoom(roomData) {
    if (!this.socket) return;
    this.socket.emit("joinRoom", roomData);
  }

  leaveRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit("leaveRoom", roomId);
  }

  // Group management
  createGroup(groupData) {
    if (!this.socket) return;
    this.socket.emit("createGroup", groupData);
  }

  joinGroup(groupId) {
    if (!this.socket) return;
    this.socket.emit("joinGroup", groupId);
  }

  leaveGroup(groupId) {
    if (!this.socket) return;
    this.socket.emit("leaveGroup", groupId);
  }

  getGroups() {
    if (!this.socket) return;
    this.socket.emit("getGroups");
  }

  addUserToGroup(groupId, userId) {
    if (!this.socket) return;
    this.socket.emit("addUserToGroup", { groupId, userId });
  }

  removeUserFromGroup(groupId, userId) {
    if (!this.socket) return;
    this.socket.emit("removeUserFromGroup", { groupId, userId });
  }

  // Typing indicators
  sendTypingStatus(isTyping, context = {}) {
    if (!this.socket) return;

    // Don't send typing status if it's the same as last sent
    const typingKey = `${context.type}_${context.receiverId || context.roomId || "public"}`;
    const lastTypingStatus = this.lastTypingStatus?.[typingKey];

    if (lastTypingStatus === isTyping) {
      return; // Don't send duplicate typing status
    }

    const typingData = {
      isTyping,
      ...context,
    };

    // Store last typing status
    if (!this.lastTypingStatus) {
      this.lastTypingStatus = {};
    }
    this.lastTypingStatus[typingKey] = isTyping;

    console.log("Sending typing status:", typingData);
    this.socket.emit("typing", typingData);
  }

  // Message status
  markMessageAsRead(messageId) {
    if (!this.socket) return;
    this.socket.emit("markMessageAsRead", messageId);
  }

  markAllMessagesAsRead(userId) {
    if (!this.socket) return;
    this.socket.emit("markAllMessagesAsRead", { userId });
  }

  markPrivateMessageAsRead(messageId) {
    if (!this.socket) return;
    this.socket.emit("markPrivateMessageAsRead", messageId);
  }

  // Message actions
  editPrivateMessage(data) {
    if (!this.socket) return;
    this.socket.emit("editPrivateMessage", data);
  }

  deletePrivateMessage(messageId) {
    if (!this.socket) return;
    this.socket.emit("deletePrivateMessage", messageId);
  }

  // Unread count
  getUnreadCount() {
    if (!this.initialized || !this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.emit("getUnreadCount");
  }

  // Event listeners
  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on("userJoined", callback);
  }
  offUserJoined(callback) {
    if (!this.socket) return;
    this.socket.off("userJoined", callback);
  }

  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on("userLeft", callback);
  }
  offUserLeft(callback) {
    if (!this.socket) return;
    this.socket.off("userLeft", callback);
  }

  onUsersList(callback) {
    if (!this.socket) return;
    this.socket.on("usersList", callback);
  }
  offUsersList(callback) {
    if (!this.socket) return;
    this.socket.off("usersList", callback);
  }

  onMessage(callback) {
    if (!this.socket) return;
    this.socket.on("message", callback);
    this.socket.on("publicMessage", callback);
  }
  offMessage(callback) {
    if (!this.socket) return;
    this.socket.off("message", callback);
    this.socket.off("publicMessage", callback);
  }

  onPrivateMessage(callback) {
    if (!this.socket) return;
    this.socket.on("privateMessage", callback);
  }
  offPrivateMessage(callback) {
    if (!this.socket) return;
    this.socket.off("privateMessage", callback);
  }

  onRoomMessage(callback) {
    if (!this.socket) return;
    this.socket.on("roomMessage", callback);
  }
  offRoomMessage(callback) {
    if (!this.socket) return;
    this.socket.off("roomMessage", callback);
  }

  onPublicMessage(callback) {
    if (!this.socket) return;
    this.socket.on("publicMessage", callback);
  }
  offPublicMessage(callback) {
    if (!this.socket) return;
    this.socket.off("publicMessage", callback);
  }

  onMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("messageHistory", callback);
  }
  offMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.off("messageHistory", callback);
  }

  onPrivateMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("privateMessageHistory", callback);
  }
  offPrivateMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.off("privateMessageHistory", callback);
  }

  onRoomMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("roomMessageHistory", callback);
  }
  offRoomMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.off("roomMessageHistory", callback);
  }

  onPublicMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("publicMessageHistory", callback);
  }
  offPublicMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.off("publicMessageHistory", callback);
  }

  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on("userTyping", callback);
  }
  offUserTyping(callback) {
    if (!this.socket) return;
    this.socket.off("userTyping", callback);
  }

  onMessageRead(callback) {
    if (!this.socket) return;
    this.socket.on("messageRead", callback);
  }
  offMessageRead(callback) {
    if (!this.socket) return;
    this.socket.off("messageRead", callback);
  }

  onAllMessagesRead(callback) {
    if (!this.socket) return;
    this.socket.on("allMessagesRead", callback);
  }
  offAllMessagesRead(callback) {
    if (!this.socket) return;
    this.socket.off("allMessagesRead", callback);
  }

  onMessageDelivered(callback) {
    if (!this.socket) return;
    this.socket.on("messageDelivered", callback);
  }
  offMessageDelivered(callback) {
    if (!this.socket) return;
    this.socket.off("messageDelivered", callback);
  }

  onMessageEdited(callback) {
    if (!this.socket) return;
    this.socket.on("messageEdited", callback);
  }
  offMessageEdited(callback) {
    if (!this.socket) return;
    this.socket.off("messageEdited", callback);
  }

  onMessageDeleted(callback) {
    if (!this.socket) return;
    this.socket.on("messageDeleted", callback);
  }
  offMessageDeleted(callback) {
    if (!this.socket) return;
    this.socket.off("messageDeleted", callback);
  }

  onUnreadCounts(callback) {
    if (!this.socket) return;
    this.socket.on("unreadCounts", callback);
  }
  offUnreadCounts(callback) {
    if (!this.socket) return;
    this.socket.off("unreadCounts", callback);
  }

  onRoomJoined(callback) {
    if (!this.socket) return;
    this.socket.on("roomJoined", callback);
  }
  offRoomJoined(callback) {
    if (!this.socket) return;
    this.socket.off("roomJoined", callback);
  }

  onRoomLeft(callback) {
    if (!this.socket) return;
    this.socket.on("roomLeft", callback);
  }
  offRoomLeft(callback) {
    if (!this.socket) return;
    this.socket.off("roomLeft", callback);
  }

  onUserJoinedRoom(callback) {
    if (!this.socket) return;
    this.socket.on("userJoinedRoom", callback);
  }
  offUserJoinedRoom(callback) {
    if (!this.socket) return;
    this.socket.off("userJoinedRoom", callback);
  }

  onUserLeftRoom(callback) {
    if (!this.socket) return;
    this.socket.on("userLeftRoom", callback);
  }
  offUserLeftRoom(callback) {
    if (!this.socket) return;
    this.socket.off("userLeftRoom", callback);
  }

  onTokenRefreshed(callback) {
    if (!this.socket) return;
    this.socket.on("tokenRefreshed", callback);
  }
  offTokenRefreshed(callback) {
    if (!this.socket) return;
    this.socket.off("tokenRefreshed", callback);
  }

  onError(callback) {
    if (!this.socket) return;
    this.socket.on("error", callback);
  }
  offError(callback) {
    if (!this.socket) return;
    this.socket.off("error", callback);
  }

  // Group event listeners
  onGroupsList(callback) {
    if (!this.socket) return;
    this.socket.on("groupsList", callback);
  }
  offGroupsList(callback) {
    if (!this.socket) return;
    this.socket.off("groupsList", callback);
  }

  onGroupCreated(callback) {
    if (!this.socket) return;
    this.socket.on("groupCreated", callback);
  }
  offGroupCreated(callback) {
    if (!this.socket) return;
    this.socket.off("groupCreated", callback);
  }

  onGroupJoined(callback) {
    if (!this.socket) return;
    this.socket.on("groupJoined", callback);
  }
  offGroupJoined(callback) {
    if (!this.socket) return;
    this.socket.off("groupJoined", callback);
  }

  onGroupLeft(callback) {
    if (!this.socket) return;
    this.socket.on("groupLeft", callback);
  }
  offGroupLeft(callback) {
    if (!this.socket) return;
    this.socket.off("groupLeft", callback);
  }

  onUserAddedToGroup(callback) {
    if (!this.socket) return;
    this.socket.on("userAddedToGroup", callback);
  }
  offUserAddedToGroup(callback) {
    if (!this.socket) return;
    this.socket.off("userAddedToGroup", callback);
  }

  onUserRemovedFromGroup(callback) {
    if (!this.socket) return;
    this.socket.on("userRemovedFromGroup", callback);
  }
  offUserRemovedFromGroup(callback) {
    if (!this.socket) return;
    this.socket.off("userRemovedFromGroup", callback);
  }
}

// Create and export a single instance
const socketService = new SocketService();
export { socketService };
