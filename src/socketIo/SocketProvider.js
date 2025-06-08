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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("usersList", onUsersList);
    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("userTyping", onUserTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("usersList", onUsersList);
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("userTyping", onUserTyping);
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

  const value = {
    socket,
    isConnected,
    dbUser, // Provide dbUser from AuthContext for role-based UI
    users,
    typingUsers,
    joinAsGuest,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
