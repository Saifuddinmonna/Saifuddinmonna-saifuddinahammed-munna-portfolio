import React from "react";
import { FaTimes, FaUsers } from "react-icons/fa";

const CreateGroupModal = ({
  showCreateGroup,
  setShowCreateGroup,
  handleCreateGroup,
  newGroupName,
  setNewGroupName,
  newGroupDescription,
  setNewGroupDescription,
  users,
  selectedUsersForGroup,
  toggleUserSelection,
  isCreatingGroup,
}) => {
  if (!showCreateGroup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--background-paper)] rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Group</h3>
          <button
            onClick={() => setShowCreateGroup(false)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
              required
              maxLength={100}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {newGroupName.length}/100 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Description
            </label>
            <textarea
              value={newGroupDescription}
              onChange={e => setNewGroupDescription(e.target.value)}
              placeholder="Enter group description"
              className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
              rows="3"
              maxLength={500}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {newGroupDescription.length}/500 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Add Members ({selectedUsersForGroup.length} selected)
            </label>
            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-[var(--background-default)]">
              {users.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] text-center py-2">
                  No users available
                </p>
              ) : (
                users.map(user => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 p-1 hover:bg-[var(--background-hover)] rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsersForGroup.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded text-[var(--primary-main)] focus:ring-[var(--primary-main)]"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--primary-main)] flex items-center justify-center text-white text-xs">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm text-[var(--text-primary)] font-medium">
                          {user.name}
                        </span>
                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedUsersForGroup.length > 0 && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Selected: {selectedUsersForGroup.length} user
                {selectedUsersForGroup.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 p-2 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2"
              disabled={!newGroupName.trim() || isCreatingGroup}
            >
              {isCreatingGroup ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaUsers />
                  Create Group
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateGroup(false)}
              className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
