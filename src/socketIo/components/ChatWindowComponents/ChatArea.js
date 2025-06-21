import React, { useContext } from "react";
import { FaPaperPlane, FaTimes, FaSmile, FaCheck, FaUsers } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { ThemeContext } from "../../../App";

const ChatArea = ({
  connected,
  isLoading,
  activeChatTab,
  selectedGroup,
  setSelectedGroup,
  currentTheme,
  currentMessages,
  renderMessages: renderMessagesProp,
  messagesEndRef,
  editingMessage,
  handleUpdateMessage,
  editText,
  setEditText,
  handleCancelEdit,
  handleSendMessage,
  inputValue,
  handleInputChange,
  handleKeyDown,
  isSending,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiSelect,
  typingUsers,
  selectedPrivateChatUser,
  onTextAreaClick,
  users,
  currentUserId,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  const renderMessages = () => {
    const messagesToRender = Array.isArray(currentMessages) ? currentMessages : [];

    if (messagesToRender.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-[var(--text-secondary)]">
          <div className="text-center">
            <FaUsers className="mx-auto mb-2 text-2xl opacity-50" />
            <p className="text-sm">
              {activeChatTab === "group" && selectedGroup
                ? `No messages in ${selectedGroup.name} yet`
                : activeChatTab === "private" && selectedPrivateChatUser
                ? `No messages with ${selectedPrivateChatUser.name} yet`
                : "No messages yet"}
            </p>
            <p className="text-xs mt-1 opacity-75">Start a conversation!</p>
          </div>
        </div>
      );
    }

    return messagesToRender.map((message, index) => {
      const senderUser = users.find(
        u =>
          u.uid === message.sender?.uid ||
          u.id === message.sender?.id ||
          u._id === message.sender?._id
      );
      const senderName = message.senderName || senderUser?.name || message.sender?.name || "User";
      const isCurrentUser =
        message.sender?.uid === currentUserId || message.senderId === currentUserId;

      const showNameAbove =
        !isCurrentUser &&
        (index === 0 || messagesToRender[index - 1].sender?.uid !== message.sender?.uid);

      return (
        <div
          key={message._id || message.id || index}
          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} w-full`}
          style={{ marginTop: showNameAbove ? 16 : 6 }}
        >
          <div className="flex flex-col items-start max-w-full w-full">
            {showNameAbove && (
              <div className="text-xs font-bold mb-1 ml-2 text-[var(--text-secondary)]">
                {senderName}
              </div>
            )}
            <div
              className={`rounded-xl px-4 py-2 shadow-md break-words max-w-[80%] sm:max-w-[80%] w-fit ${
                isCurrentUser
                  ? "bg-[var(--primary-main)] text-white ml-auto"
                  : "bg-[var(--background-default)] text-[var(--text-primary)] mr-auto"
              }`}
              style={{
                marginLeft: isCurrentUser ? "auto" : 0,
                marginRight: isCurrentUser ? 0 : "auto",
                border: isCurrentUser
                  ? "2px solid var(--primary-light)"
                  : "1px solid var(--border-main)",
                maxWidth: window.innerWidth < 640 ? "90%" : "80%",
                minWidth: 40,
                fontSize: 15,
              }}
            >
              {message.message || message.text}
            </div>
            <div
              className={`text-xs mt-1 opacity-70 ${isCurrentUser ? "text-right" : "text-left"}`}
              style={{
                color: "var(--text-secondary)",
                maxWidth: window.innerWidth < 640 ? "90%" : "80%",
                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderChatContent = () => {
    if (!connected) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] font-medium">Connecting to chat server...</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Please wait while we establish connection
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] font-medium">Loading messages...</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Fetching your conversation history
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Chat Header */}
        {activeChatTab === "group" && selectedGroup && (
          <div className="p-3 border-b bg-[var(--background-default)] border-[var(--border-main)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-main)] flex items-center justify-center text-white text-sm font-semibold">
                {selectedGroup.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{selectedGroup.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {selectedGroup.members?.length || 0} members
                  {selectedGroup.description && (
                    <span className="ml-2">• {selectedGroup.description}</span>
                  )}
                </p>
                {selectedGroup.creatorName && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Created by {selectedGroup.creatorName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Back to groups"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="chat-messages-container p-4">
          <div className="space-y-4">{renderMessages()}</div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          {editingMessage ? (
            <form onSubmit={handleUpdateMessage} className="p-2 md:p-0">
              <div className="relative">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  placeholder="Edit your message..."
                  className="w-full p-2 pr-10 sm:pr-20 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] max-h-[20vh] md:max-h-[30vh] bg-[var(--background-paper)] border-[var(--border-main)] text-[var(--text-primary)]"
                  rows="2"
                />
                <div className="absolute top-0 right-2 flex flex-col sm:flex-row gap-1">
                  <button
                    type="submit"
                    className="p-1 md:p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors text-xs md:text-sm"
                  >
                    <FaCheck />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-1 md:p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs md:text-sm"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-end gap-1 md:gap-2 p-2 md:p-0">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onClick={onTextAreaClick}
                  placeholder={
                    activeChatTab === "private" && selectedPrivateChatUser
                      ? `Message ${selectedPrivateChatUser.name}...`
                      : activeChatTab === "group" && selectedGroup
                      ? `Message ${selectedGroup.name}...`
                      : "Type a message..."
                  }
                  className="w-full p-2 pr-12 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] max-h-[25vh] md:max-h-[35vh] bg-[var(--background-paper)] border-[var(--border-main)] text-[var(--text-primary)]"
                  rows="2"
                  disabled={isSending}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors p-1"
                  >
                    <FaSmile />
                  </button>
                  <button
                    type="submit"
                    className={`p-1 rounded transition-colors ${
                      isSending || !inputValue.trim()
                        ? "bg-[var(--border-main)] text-[var(--text-disabled)] cursor-not-allowed"
                        : "bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] text-white"
                    }`}
                    disabled={isSending || !inputValue.trim()}
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <FaPaperPlane size={12} />
                    )}
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
              </div>
            </form>
          )}
          {typingUsers.length > 0 && (
            <div className="mt-2 text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[var(--primary-main)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">{renderChatContent()}</div>
  );
};

export default ChatArea;
