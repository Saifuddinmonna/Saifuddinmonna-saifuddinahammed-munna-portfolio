import React, { useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

const MessageHistory = () => {
  const { messages } = useSocket();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = timestamp => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const formatDate = timestamp => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy");
    } catch (error) {
      return "";
    }
  };

  const renderMessageStatus = message => {
    if (message.sender.id === currentUser?.uid) {
      switch (message.status) {
        case "sending":
          return <span className="text-gray-400 text-xs">Sending...</span>;
        case "sent":
          return <span className="text-gray-400 text-xs">Sent</span>;
        case "delivered":
          return <span className="text-green-400 text-xs">Delivered</span>;
        default:
          return null;
      }
    }
    return null;
  };

  const renderMessageGroup = messages => {
    let currentDate = null;
    let currentSender = null;

    return messages.map((message, index) => {
      const showDate = currentDate !== formatDate(message.timestamp);
      const showSender = currentSender !== message.sender.id;

      if (showDate) {
        currentDate = formatDate(message.timestamp);
      }
      if (showSender) {
        currentSender = message.sender.id;
      }

      const isOwnMessage = message.sender.id === currentUser?.uid;

      return (
        <React.Fragment key={message.id}>
          {showDate && (
            <div className="flex justify-center my-4">
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {formatDate(message.timestamp)}
              </span>
            </div>
          )}

          <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}>
            <div
              className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}
            >
              {showSender && !isOwnMessage && (
                <span className="text-xs text-gray-500 mb-1">
                  {message.sender.isAdmin ? "👑 " : ""}
                  {message.sender.name}
                </span>
              )}

              <div
                className={`rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        </div>
      ) : (
        renderMessageGroup(messages)
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageHistory;
