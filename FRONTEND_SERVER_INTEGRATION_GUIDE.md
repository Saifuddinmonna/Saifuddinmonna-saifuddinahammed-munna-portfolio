# Frontend-Server Group Integration Guide

## 📋 Overview

আপনার server-side group functionality এর সাথে frontend integrate করার জন্য complete guide।

## 🔗 API Integration Points

### 1. Socket.IO Events Mapping

#### Frontend → Server Events:

```javascript
// Group Creation
socket.emit('createGroup', {
  name: string,
  description: string,
  createdBy: string,
  members: string[],
  settings: {
    isPublic: boolean,
    allowMemberInvite: boolean,
    requireApproval: boolean
  }
});

// Group Management
socket.emit('joinGroup', groupId);
socket.emit('leaveGroup', groupId);
socket.emit('addUserToGroup', { groupId, userId });
socket.emit('removeUserFromGroup', { groupId, userId });
socket.emit('promoteToAdmin', { groupId, userId });
socket.emit('demoteFromAdmin', { groupId, userId });

// Group Messaging
socket.emit('groupMessage', {
  groupId: string,
  text: string,
  type: 'text' | 'image' | 'file',
  attachments?: any[]
});

// Group Settings
socket.emit('updateGroupSettings', {
  groupId: string,
  settings: {
    name?: string,
    description?: string,
    isPublic?: boolean,
    allowMemberInvite?: boolean,
    requireApproval?: boolean
  }
});
```

#### Server → Frontend Events:

```javascript
// Listen for these events in frontend
socket.on("groupCreated", group => {
  /* Update UI */
});
socket.on("groupJoined", data => {
  /* Update UI */
});
socket.on("groupLeft", data => {
  /* Update UI */
});
socket.on("userAddedToGroup", data => {
  /* Update UI */
});
socket.on("userRemovedFromGroup", data => {
  /* Update UI */
});
socket.on("groupMessage", message => {
  /* Add message to chat */
});
socket.on("groupSettingsUpdated", data => {
  /* Update group info */
});
```

### 2. REST API Integration

#### Group Management APIs:

```javascript
// Get all groups
GET /api/groups
Headers: { Authorization: 'Bearer <token>' }

// Get specific group
GET /api/groups/:groupId
Headers: { Authorization: 'Bearer <token>' }

// Get group members
GET /api/groups/:groupId/members
Headers: { Authorization: 'Bearer <token>' }

// Get group messages
GET /api/groups/:groupId/messages?page=1&limit=50
Headers: { Authorization: 'Bearer <token>' }

// Update group settings
PUT /api/groups/:groupId
Headers: { Authorization: 'Bearer <token>' }
Body: {
  name?: string,
  description?: string,
  settings?: object
}

// Delete group
DELETE /api/groups/:groupId
Headers: { Authorization: 'Bearer <token>' }
```

## 🎯 Frontend Data Collection Suggestions

### 1. Group Creation Form Enhancement

```javascript
// Enhanced group creation data structure
const groupCreationData = {
  name: string,                    // Required
  description: string,             // Optional
  createdBy: string,               // Current user ID
  members: string[],               // Selected user IDs
  settings: {
    isPublic: boolean,             // Default: true
    allowMemberInvite: boolean,    // Default: true
    requireApproval: boolean,      // Default: false
    maxMembers: number,            // Default: 100
    allowFileSharing: boolean,     // Default: true
    allowImageSharing: boolean,    // Default: true
    messageRetentionDays: number   // Default: 30
  },
  category: string,                // Optional: 'general', 'work', 'study', etc.
  tags: string[],                  // Optional: for search/filtering
  avatar: string                   // Optional: group avatar URL
};
```

### 2. User Selection Enhancement

```javascript
// Enhanced user selection with roles
const userSelectionData = {
  users: [
    {
      id: string,
      name: string,
      email: string,
      role: 'user' | 'admin',
      avatar: string,
      isOnline: boolean,
      lastSeen: Date
    }
  ],
  selectedUsers: string[],         // User IDs
  defaultRole: 'member' | 'admin', // Default role for new members
  inviteMessage: string            // Optional custom invite message
};
```

### 3. Group Settings Form

```javascript
// Group settings form data
const groupSettingsData = {
  basic: {
    name: string,
    description: string,
    category: string,
    tags: string[]
  },
  privacy: {
    isPublic: boolean,
    allowMemberInvite: boolean,
    requireApproval: boolean,
    showMemberList: boolean
  },
  messaging: {
    allowFileSharing: boolean,
    allowImageSharing: boolean,
    allowVoiceMessages: boolean,
    messageRetentionDays: number,
    slowMode: boolean,
    slowModeInterval: number // seconds
  },
  moderation: {
    enableModeration: boolean,
    autoDeleteProfanity: boolean,
    requireMessageApproval: boolean,
    bannedWords: string[]
  }
};
```

## 🔧 Frontend Implementation Updates

### 1. Update SocketProvider.js

```javascript
// Add these new event listeners
socketService.onGroupSettingsUpdated(data => {
  setGroups(prev =>
    prev.map(group => (group.id === data.groupId ? { ...group, ...data.settings } : group))
  );
  toast.success("Group settings updated successfully!");
});

socketService.onGroupDeleted(data => {
  setGroups(prev => prev.filter(group => group.id !== data.groupId));
  if (selectedGroup?.id === data.groupId) {
    setSelectedGroup(null);
  }
  toast.success("Group deleted successfully!");
});

socketService.onGroupMessageHistory(history => {
  setRoomMessages(prev => ({
    ...prev,
    [history.groupId]: history.messages,
  }));
});
```

### 2. Update ChatWindow.js

```javascript
// Enhanced group creation form
const [groupSettings, setGroupSettings] = useState({
  isPublic: true,
  allowMemberInvite: true,
  requireApproval: false,
  maxMembers: 100,
  allowFileSharing: true,
  allowImageSharing: true,
  messageRetentionDays: 30,
});

const [groupCategory, setGroupCategory] = useState("general");
const [groupTags, setGroupTags] = useState([]);
const [inviteMessage, setInviteMessage] = useState("");

// Enhanced handleCreateGroup
const handleCreateGroup = async e => {
  e.preventDefault();

  const groupData = {
    name: newGroupName.trim(),
    description: newGroupDescription.trim(),
    createdBy: firebaseUser.uid,
    members: selectedUsersForGroup,
    settings: groupSettings,
    category: groupCategory,
    tags: groupTags,
    inviteMessage: inviteMessage.trim(),
  };

  try {
    await createGroup(groupData);
    // Reset form
    setGroupSettings({
      isPublic: true,
      allowMemberInvite: true,
      requireApproval: false,
      maxMembers: 100,
      allowFileSharing: true,
      allowImageSharing: true,
      messageRetentionDays: 30,
    });
    setGroupCategory("general");
    setGroupTags([]);
    setInviteMessage("");
  } catch (error) {
    toast.error("Failed to create group");
  }
};
```

### 3. Add Group Settings Modal

```javascript
// Group settings modal component
const GroupSettingsModal = ({ group, isOpen, onClose }) => {
  const [settings, setSettings] = useState(group?.settings || {});

  const handleSaveSettings = async () => {
    try {
      await updateGroupSettings(group.id, settings);
      onClose();
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Group Settings</h3>

        {/* Basic Settings */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Basic Information</h4>
          <input
            type="text"
            value={settings.name || ""}
            onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Group name"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={settings.description || ""}
            onChange={e => setSettings(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Group description"
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* Privacy Settings */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Privacy</h4>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.isPublic || false}
              onChange={e => setSettings(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="mr-2"
            />
            Public group (anyone can join)
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.allowMemberInvite || false}
              onChange={e =>
                setSettings(prev => ({ ...prev, allowMemberInvite: e.target.checked }))
              }
              className="mr-2"
            />
            Allow members to invite others
          </label>
        </div>

        {/* Messaging Settings */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Messaging</h4>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.allowFileSharing || false}
              onChange={e => setSettings(prev => ({ ...prev, allowFileSharing: e.target.checked }))}
              className="mr-2"
            />
            Allow file sharing
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.allowImageSharing || false}
              onChange={e =>
                setSettings(prev => ({ ...prev, allowImageSharing: e.target.checked }))
              }
              className="mr-2"
            />
            Allow image sharing
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

## 📊 Data Validation & Error Handling

### 1. Frontend Validation

```javascript
// Group creation validation
const validateGroupCreation = data => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Group name must be at least 3 characters long";
  }

  if (data.name && data.name.length > 100) {
    errors.name = "Group name cannot exceed 100 characters";
  }

  if (data.description && data.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  if (data.members && data.members.length > data.settings.maxMembers) {
    errors.members = `Cannot add more than ${data.settings.maxMembers} members`;
  }

  if (data.tags && data.tags.length > 10) {
    errors.tags = "Cannot add more than 10 tags";
  }

  return errors;
};
```

### 2. Error Handling

```javascript
// Enhanced error handling
const handleGroupError = error => {
  console.error("Group operation error:", error);

  if (error.code === "PERMISSION_DENIED") {
    toast.error("You do not have permission to perform this action");
  } else if (error.code === "GROUP_NOT_FOUND") {
    toast.error("Group not found");
  } else if (error.code === "ALREADY_MEMBER") {
    toast.error("You are already a member of this group");
  } else if (error.code === "NOT_MEMBER") {
    toast.error("You are not a member of this group");
  } else if (error.code === "GROUP_FULL") {
    toast.error("Group has reached maximum member limit");
  } else {
    toast.error(error.message || "An error occurred");
  }
};
```

## 🧪 Testing Checklist

### Frontend Testing:

- [ ] Group creation with all settings
- [ ] Group joining/leaving
- [ ] Member management (add/remove)
- [ ] Admin management (promote/demote)
- [ ] Group settings update
- [ ] Group messaging
- [ ] Message history loading
- [ ] Real-time updates
- [ ] Error handling
- [ ] Form validation
- [ ] Responsive design

### Integration Testing:

- [ ] Socket connection stability
- [ ] API response handling
- [ ] Data synchronization
- [ ] Offline/online behavior
- [ ] Performance with large groups
- [ ] Security validation

## 🚀 Performance Optimizations

### 1. Data Loading

```javascript
// Implement pagination for group messages
const loadGroupMessages = async (groupId, page = 1, limit = 50) => {
  try {
    const response = await fetch(`/api/groups/${groupId}/messages?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading messages:", error);
    return { messages: [], hasMore: false };
  }
};
```

### 2. Caching

```javascript
// Cache group data
const groupCache = new Map();

const getGroupData = async groupId => {
  if (groupCache.has(groupId)) {
    return groupCache.get(groupId);
  }

  const groupData = await fetchGroupData(groupId);
  groupCache.set(groupId, groupData);
  return groupData;
};
```

এই guide follow করে আপনি frontend এবং server এর মধ্যে perfect integration করতে পারবেন! 🎉
