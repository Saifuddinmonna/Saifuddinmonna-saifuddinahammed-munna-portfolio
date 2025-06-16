import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../auth/context/AuthContext";
import { FaUser, FaCircle } from "react-icons/fa";

const PrivateChatHistory = ({ selectedUser, onSelectUser }) => {
  const { token } = useAuth();

  const {
    data: privateMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["privateMessages", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return [];
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/private-messages/history/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data.messages;
    },
    enabled: !!selectedUser?.id && !!token,
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading messages</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {privateMessages?.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start mb-4 ${
            msg.senderId === selectedUser.id ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`rounded-lg p-3 max-w-[70%] ${
              msg.senderId === selectedUser.id
                ? "bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)]"
                : "bg-[var(--primary-main)] text-white"
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {msg.senderId === selectedUser.id ? selectedUser.name : "You"}
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            <div className="text-xs mt-1 opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivateChatHistory;
