import React, { useEffect } from "react";
import { useSocket } from "../SocketProvider";
import { useAuth } from "../../auth/context/AuthContext";
import { FaUser, FaCircle } from "react-icons/fa";

const PrivateChatHistory = ({ selectedUser, onSelectUser }) => {
  const { privateMessages, unreadCounts, markAllMessagesAsRead, requestPrivateHistory } =
    useSocket();
  const { user: firebaseUser } = useAuth();

  useEffect(() => {
    if (selectedUser?.uid) {
      requestPrivateHistory(selectedUser.uid);
      markAllMessagesAsRead(selectedUser.uid);
    }
  }, [selectedUser?.uid, requestPrivateHistory, markAllMessagesAsRead]);

  if (!selectedUser) {
    return <div className="p-4 text-center">Select a user to start chatting</div>;
  }

  const messages = privateMessages[selectedUser.uid] || [];

  if (messages.length === 0) {
    return <div className="p-4 text-center">No messages yet</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex items-start mb-4 ${
            msg.sender.uid === firebaseUser?.uid ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`rounded-lg p-3 max-w-[70%] ${
              msg.sender.uid === firebaseUser?.uid
                ? "bg-[var(--primary-main)] text-white"
                : "bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)]"
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {msg.sender.uid === firebaseUser?.uid ? "You" : msg.sender.name}
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            <div className="text-xs mt-1 opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.edited && <span className="ml-2">(edited)</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivateChatHistory;
