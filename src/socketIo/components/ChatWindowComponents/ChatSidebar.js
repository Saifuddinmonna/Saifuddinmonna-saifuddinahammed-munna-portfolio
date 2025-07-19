import React from "react";
import { FaUsers, FaChevronLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useIsAdminSync } from "../../../utils/adminUtils";

const ChatSidebar = ({
  activeChatTab,
  searchQuery,
  setSearchQuery,
  dbUser,
  setShowCreateGroup,
  filteredGroups,
  filteredUsers,
  handleSelectPrivateChatUser,
  selectedPrivateChatUser,
  unreadCounts,
  currentUserId,
  handleSelectGroup,
  selectedGroup,
  handleJoinGroup,
  handleLeaveGroup,
  toggleSidebar,
}) => {
  const isAdmin = useIsAdminSync();

  return (
    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r overflow-y-auto custom-scrollbar relative">
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 z-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg md:hidden"
        title="Hide sidebar"
      >
        <FaChevronLeft />
      </button>
      {activeChatTab === "private" && (
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Users</span>
            {dbUser?.data?.role === "admin" && (
              <span className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] bg-transparent"
          />
          <div className="mt-2 text-xs text-[var(--text-secondary)]">
            {(() => {
              // Count unique users by email or name to avoid duplicates from multiple browser sessions
              const uniqueUserEmails = new Set();
              const uniqueUserNames = new Set();
              let uniqueCount = 0;

              filteredUsers.forEach(user => {
                const userEmail = user.email?.toLowerCase();
                const userName = user.name?.toLowerCase();

                // Check if this user is already counted
                if (userEmail && !uniqueUserEmails.has(userEmail)) {
                  uniqueUserEmails.add(userEmail);
                  uniqueCount++;
                } else if (userName && !uniqueUserNames.has(userName)) {
                  uniqueUserNames.add(userName);
                  uniqueCount++;
                } else if (!userEmail && !userName) {
                  // Fallback for users without email or name
                  uniqueCount++;
                }
              });

              return `${uniqueCount} user${uniqueCount !== 1 ? "s" : ""} available`;
            })()}
          </div>
        </div>
      )}
      {activeChatTab === "group" && (
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="text-[var(--primary-main)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Groups</span>
            {dbUser?.data?.role === "admin" && (
              <span className="text-xs bg-[var(--primary-main)] text-white px-2 py-1 rounded-full">
                Admin
              </span>
            )}
            {/* Debug info */}
            <span className="text-xs text-gray-500">Role: {dbUser?.data?.role || "none"}</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] bg-transparent"
          />
          {/* Show create button for admin OR for testing - remove the role check temporarily */}
          {(dbUser?.data?.role === "admin" || true) && (
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full mt-2 p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors text-sm flex items-center justify-center gap-2"
            >
              <FaUsers />
              Create New Group
            </button>
          )}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">
            {filteredGroups.length} group{filteredGroups.length !== 1 ? "s" : ""} available
          </div>
        </div>
      )}
      <div className="divide-y">
        {activeChatTab === "private" &&
          (() => {
            // Additional deduplication at render level - use email/name based deduplication
            const seenUserEmails = new Set();
            const seenUserNames = new Set();
            const uniqueFilteredUsers = filteredUsers.filter(user => {
              const userEmail = user.email?.toLowerCase();
              const userName = user.name?.toLowerCase();

              // Check if this user is already shown
              if (userEmail && !seenUserEmails.has(userEmail)) {
                seenUserEmails.add(userEmail);
                return true;
              } else if (userName && !seenUserNames.has(userName)) {
                seenUserNames.add(userName);
                return true;
              } else if (!userEmail && !userName) {
                // Fallback for users without email or name
                return true;
              }
              return false;
            });

            return uniqueFilteredUsers.map(user => {
              // Check if user is admin (multiple ways)
              const isUserAdmin =
                (user.role === "admin" && user.isAdmin === true) ||
                user.role === "admin" ||
                (user.email && user.email.includes("admin")) ||
                (user.name && user.name.toLowerCase().includes("admin"));

              // Use consistent name display
              const displayName = isUserAdmin ? "admin" : user.name || user.email || "User";
              const displayEmail = isUserAdmin ? "" : user.email || "";

              return (
                <button
                  key={user.id || user.uid || user._id || user.email || user.name}
                  onClick={() => handleSelectPrivateChatUser(user)}
                  className={`w-full p-2 sm:p-3 text-left hover:bg-[var(--background-hover)] transition-colors border-b border-[var(--border-main)] ${
                    selectedPrivateChatUser?.id === user.id
                      ? "bg-[var(--primary-main)] text-white"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0 ${
                        selectedPrivateChatUser?.id === user.id
                          ? "bg-white text-[var(--primary-main)]"
                          : "bg-[var(--primary-main)]"
                      }`}
                    >
                      {isUserAdmin ? "A" : displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm truncate ${
                          selectedPrivateChatUser?.id === user.id ? "text-white" : ""
                        }`}
                      >
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p
                          className={`text-xs truncate ${
                            selectedPrivateChatUser?.id === user.id
                              ? "text-white opacity-75"
                              : "text-[var(--text-secondary)]"
                          }`}
                        >
                          {displayEmail}
                        </p>
                      )}
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedPrivateChatUser?.id === user.id
                            ? "bg-white text-[var(--primary-main)]"
                            : "bg-[var(--primary-main)] text-white"
                        }`}
                      >
                        {unreadCounts[user.id]}
                      </span>
                    )}
                  </div>
                </button>
              );
            });
          })()}
        {activeChatTab === "group" && (
          <>
            {filteredGroups.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-secondary)]">
                <FaUsers className="mx-auto mb-2 text-2xl opacity-50" />
                <p className="text-sm">No groups available</p>
                {dbUser?.data?.role === "admin" && (
                  <p className="text-xs mt-1">Create a group to get started</p>
                )}
                {dbUser?.data?.role !== "admin" && (
                  <p className="text-xs mt-1">Ask an admin to create a group</p>
                )}
                <p className="text-xs mt-2 opacity-75">Groups will appear here once created</p>
                <p className="text-xs mt-1 opacity-50">
                  You can join groups to start chatting with members
                </p>
              </div>
            ) : (
              filteredGroups.map(group => {
                const isMember = group.members?.some(member => member.id === currentUserId);
                const isCreator = group.createdBy === currentUserId;
                const memberCount = group.members?.length || 0;

                return (
                  <div
                    key={group.id}
                    className={`w-full p-2 sm:p-3 text-left hover:bg-[var(--background-hover)] transition-colors border-b border-[var(--border-main)] cursor-pointer ${
                      selectedGroup?.id === group.id ? "bg-[var(--primary-main)] text-white" : ""
                    }`}
                    onClick={() => {
                      if (isMember) {
                        handleSelectGroup(group);
                      } else {
                        toast.error("Please join the group first to chat");
                      }
                    }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                          selectedGroup?.id === group.id
                            ? "bg-white text-[var(--primary-main)]"
                            : "bg-[var(--primary-main)]"
                        }`}
                      >
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`font-semibold text-sm truncate ${
                              selectedGroup?.id === group.id ? "text-white" : ""
                            }`}
                          >
                            {group.name}
                          </p>
                          {isCreator && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedGroup?.id === group.id
                                  ? "bg-white text-[var(--primary-main)]"
                                  : "bg-[var(--primary-main)] text-white"
                              }`}
                            >
                              Creator
                            </span>
                          )}
                          {isMember && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedGroup?.id === group.id
                                  ? "bg-white text-[var(--primary-main)]"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              Member
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mb-1 ${
                            selectedGroup?.id === group.id
                              ? "text-white opacity-75"
                              : "text-[var(--text-secondary)]"
                          }`}
                        >
                          <span className="font-medium">{memberCount}</span> member
                          {memberCount !== 1 ? "s" : ""}
                          {isMember && <span className="ml-2 text-green-500">• Joined</span>}
                        </p>
                        {group.description && (
                          <p
                            className={`text-xs truncate mb-2 ${
                              selectedGroup?.id === group.id
                                ? "text-white opacity-75"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {group.description}
                          </p>
                        )}
                        {group.creatorName && (
                          <p
                            className={`text-xs ${
                              selectedGroup?.id === group.id
                                ? "text-white opacity-75"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            Created by {group.creatorName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {unreadCounts[group.id] > 0 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              selectedGroup?.id === group.id
                                ? "bg-white text-[var(--primary-main)]"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {unreadCounts[group.id]}
                          </span>
                        )}
                        <div className="flex gap-1">
                          {!isMember ? (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleJoinGroup(group.id);
                              }}
                              className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
                            >
                              Join
                            </button>
                          ) : (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleLeaveGroup(group.id);
                              }}
                              className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                            >
                              Leave
                            </button>
                          )}
                          {isMember && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleSelectGroup(group);
                              }}
                              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                                selectedGroup?.id === group.id
                                  ? "bg-white text-[var(--primary-main)]"
                                  : "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                              }`}
                            >
                              Chat
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
