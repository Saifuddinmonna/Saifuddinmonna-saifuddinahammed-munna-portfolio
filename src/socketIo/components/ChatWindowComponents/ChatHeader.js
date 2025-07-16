import React from "react";
import { FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";

const ChatHeader = ({
  connected,
  toggleTheme,
  isDarkMode,
  toggleMinimize,
  isMinimized,
  onCloseChat,
  currentTheme,
}) => {
  return (
    <div
      className="p-2 sm:p-4 border-b flex items-center justify-between rounded-t-lg"
      style={{
        background: currentTheme.primary.main,
        color: currentTheme.text.primary,
        borderBottom: `1px solid ${currentTheme.border.main}`,
      }}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Chat</h2>
        {connected ? (
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Online
          </span>
        ) : (
          <span className="text-xs bg-red-500 px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Offline
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1 rounded transition-colors border"
          style={{
            background: isDarkMode
              ? currentTheme.background.default
              : currentTheme.background.paper,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.main,
          }}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        <button
          onClick={toggleMinimize}
          className="p-1 hover:bg-[var(--primary-dark)] rounded transition-colors"
        >
          {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <button
          onClick={onCloseChat}
          className="p-1 hover:bg-[var(--primary-dark)] rounded transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
