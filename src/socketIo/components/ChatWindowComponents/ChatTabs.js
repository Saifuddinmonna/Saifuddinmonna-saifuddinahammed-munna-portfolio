import React from "react";

const ChatTabs = ({ activeChatTab, setActiveChatTab }) => {
  return (
    <div className="flex border-b">
      <button
        onClick={() => setActiveChatTab("public")}
        className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
          activeChatTab === "public"
            ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        Public
      </button>
      <button
        onClick={() => setActiveChatTab("private")}
        className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
          activeChatTab === "private"
            ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        Private
      </button>
      <button
        onClick={() => setActiveChatTab("group")}
        className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors ${
          activeChatTab === "group"
            ? "border-b-2 border-[var(--primary-main)] text-[var(--primary-main)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        Group
      </button>
    </div>
  );
};

export default ChatTabs;
