import { io } from "socket.io-client";
import { API_URL } from "../ApiForChangingTesting";

const SOCKET_URL = API_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.initialized = false;
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
  sendTypingStatus(data) {
    if (!this.socket) return;
    this.socket.emit("typing", data);
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

  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on("userLeft", callback);
  }

  onUsersList(callback) {
    if (!this.socket) return;
    this.socket.on("usersList", callback);
  }

  onMessage(callback) {
    if (!this.socket) return;
    console.log("Setting up message listener");
    this.socket.on("message", data => {
      console.log("Socket received message event:", data);
      callback(data);
    });
    // Also listen for publicMessage event
    this.socket.on("publicMessage", data => {
      console.log("Socket received publicMessage event:", data);
      callback(data);
    });
  }

  onPrivateMessage(callback) {
    if (!this.socket) return;
    console.log("Setting up private message listener");
    this.socket.on("privateMessage", data => {
      console.log("Socket received private message event:", data);
      callback(data);
    });
  }

  onRoomMessage(callback) {
    if (!this.socket) return;
    console.log("Setting up room message listener");
    this.socket.on("roomMessage", data => {
      console.log("Socket received room message event:", data);
      callback(data);
    });
  }

  onPublicMessage(callback) {
    if (!this.socket) return;
    this.socket.on("publicMessage", callback);
  }

  onMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("messageHistory", callback);
  }

  onPrivateMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("privateMessageHistory", callback);
  }

  onRoomMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("roomMessageHistory", callback);
  }

  onPublicMessageHistory(callback) {
    if (!this.socket) return;
    this.socket.on("publicMessageHistory", callback);
  }

  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on("userTyping", callback);
  }

  onMessageRead(callback) {
    if (!this.socket) return;
    this.socket.on("messageRead", callback);
  }

  onAllMessagesRead(callback) {
    if (!this.socket) return;
    this.socket.on("allMessagesRead", callback);
  }

  onMessageDelivered(callback) {
    if (!this.socket) return;
    this.socket.on("messageDelivered", callback);
  }

  onMessageEdited(callback) {
    if (!this.socket) return;
    this.socket.on("messageEdited", callback);
  }

  onMessageDeleted(callback) {
    if (!this.socket) return;
    this.socket.on("messageDeleted", callback);
  }

  onUnreadCounts(callback) {
    if (!this.socket) return;
    this.socket.on("unreadCounts", callback);
  }

  onRoomJoined(callback) {
    if (!this.socket) return;
    this.socket.on("roomJoined", callback);
  }

  onRoomLeft(callback) {
    if (!this.socket) return;
    this.socket.on("roomLeft", callback);
  }

  onUserJoinedRoom(callback) {
    if (!this.socket) return;
    this.socket.on("userJoinedRoom", callback);
  }

  onUserLeftRoom(callback) {
    if (!this.socket) return;
    this.socket.on("userLeftRoom", callback);
  }

  onTokenRefreshed(callback) {
    if (!this.socket) return;
    this.socket.on("tokenRefreshed", callback);
  }

  onError(callback) {
    if (!this.socket) return;
    this.socket.on("error", callback);
  }

  // Group event listeners
  onGroupsList(callback) {
    if (!this.socket) return;
    this.socket.on("groupsList", callback);
  }

  onGroupCreated(callback) {
    if (!this.socket) return;
    this.socket.on("groupCreated", callback);
  }

  onGroupJoined(callback) {
    if (!this.socket) return;
    this.socket.on("groupJoined", callback);
  }

  onGroupLeft(callback) {
    if (!this.socket) return;
    this.socket.on("groupLeft", callback);
  }

  onUserAddedToGroup(callback) {
    if (!this.socket) return;
    this.socket.on("userAddedToGroup", callback);
  }

  onUserRemovedFromGroup(callback) {
    if (!this.socket) return;
    this.socket.on("userRemovedFromGroup", callback);
  }
}

// Create and export a single instance
const socketService = new SocketService();
export { socketService };
