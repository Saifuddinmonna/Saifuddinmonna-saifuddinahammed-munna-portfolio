# 🔗 Frontend-Server Integration Guide

## 🎯 Overview

This document provides comprehensive guidance on integrating the React frontend with the Node.js backend server, including API communication, real-time features, authentication, and data synchronization.

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React App     │ ◄──────────────► │   Node.js API   │
│   (Frontend)    │                  │   (Backend)     │
└─────────────────┘                  └─────────────────┘
         │                                    │
         │ WebSocket                          │ MongoDB
         │ (Socket.IO)                        │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│  Real-time      │                  │   Database      │
│  Chat System    │                  │   (MongoDB)     │
└─────────────────┘                  └─────────────────┘
```

### Technology Stack

- **Frontend**: React 18.2.0, React Router 6.4.5, Socket.IO Client 4.8.1
- **Backend**: Node.js, Express.js, Socket.IO 4.8.1
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth with JWT tokens
- **Real-time**: Socket.IO for live chat and notifications

## 🔧 API Integration

### 1. Base API Configuration

#### API Service Setup

```javascript
// src/services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Service Layer Pattern

```javascript
// src/services/testimonialService.js
import api from "./api";

class TestimonialService {
  // Get all testimonials
  async getAllTestimonials() {
    try {
      const response = await api.get("/api/testimonials");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch testimonials");
    }
  }

  // Create new testimonial
  async createTestimonial(testimonialData) {
    try {
      const response = await api.post("/api/testimonials", testimonialData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create testimonial");
    }
  }

  // Update testimonial status (admin only)
  async updateTestimonialStatus(id, status) {
    try {
      const response = await api.patch(`/api/testimonials/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update testimonial status");
    }
  }

  // Delete testimonial (admin only)
  async deleteTestimonialAdmin(id) {
    try {
      const response = await api.delete(`/api/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete testimonial");
    }
  }
}

export default new TestimonialService();
```

### 2. React Query Integration

#### Query Configuration

```javascript
// src/App.js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Custom Hooks for API Calls

```javascript
// src/hooks/useTestimonials.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import testimonialService from "../services/testimonialService";
import { toast } from "react-hot-toast";

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialService.getAllTestimonials,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
      toast.success("Testimonial submitted successfully!");
    },
    onError: error => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTestimonialStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => testimonialService.updateTestimonialStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
      toast.success("Testimonial status updated successfully");
    },
    onError: error => {
      toast.error(error.message);
    },
  });
};
```

## 💬 Real-time Integration

### 1. Socket.IO Client Setup

#### Socket Provider

```javascript
// src/socketIo/SocketProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", error => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const connect = () => {
    if (socket && !isConnected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  };

  const value = {
    socket,
    isConnected,
    connect,
    disconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
```

#### Chat Integration

```javascript
// src/socketIo/components/ChatWindow.js
import React, { useState, useEffect } from "react";
import { useSocket } from "../SocketProvider";

const ChatWindow = () => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("new-message", message => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    socket.on("user-typing", data => {
      // Handle typing indicator
    });

    // Listen for user join/leave
    socket.on("user-joined", user => {
      console.log(`${user.name} joined the chat`);
    });

    socket.on("user-left", user => {
      console.log(`${user.name} left the chat`);
    });

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket]);

  const sendMessage = e => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      text: newMessage,
      timestamp: new Date().toISOString(),
      roomId: "public", // or specific room ID
    };

    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  const joinRoom = roomId => {
    if (socket) {
      socket.emit("join-room", roomId);
    }
  };

  const leaveRoom = roomId => {
    if (socket) {
      socket.emit("leave-room", roomId);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <span className={`status ${isConnected ? "connected" : "disconnected"}`}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="user">{message.user}</span>
            <span className="text">{message.text}</span>
            <span className="time">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
```

## 🔐 Authentication Integration

### 1. Firebase Auth with Backend

#### Auth Context

```javascript
// src/auth/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/authService";
import { onAuthStateChanged, signOut } from "firebase/auth";
import api from "../../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("authToken", token);
          setTokenReady(true);

          // Verify token with backend
          const response = await api.get("/api/auth/me");
          setUser(response.data.data); // Extract data property
        } catch (error) {
          console.error("Auth verification failed:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
        setTokenReady(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    loading,
    tokenReady,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### Protected Routes

```javascript
// src/components/layout/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## 📊 Data Synchronization

### 1. Optimistic Updates

#### Blog Management

```javascript
// src/components/Blog/Blog.js
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../../services/blogService";
import { toast } from "react-hot-toast";

const Blog = () => {
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: blogService.getAllPosts,
  });

  // Like post mutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: blogService.likePost,
    onMutate: async postId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["blog-posts"]);

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["blog-posts"]);

      // Optimistically update
      queryClient.setQueryData(["blog-posts"], old =>
        old.map(post =>
          post._id === postId ? { ...post, likes: post.likes + 1, isLiked: true } : post
        )
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(["blog-posts"], context.previousPosts);
      toast.error("Failed to like post");
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(["blog-posts"]);
    },
  });

  const handleLike = postId => {
    likeMutation.mutate(postId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="blog-container">
      {posts?.map(post => (
        <div key={post._id} className="blog-post">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <button onClick={() => handleLike(post._id)} disabled={likeMutation.isLoading}>
            ❤️ {post.likes} {post.isLiked ? "Liked" : "Like"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Blog;
```

### 2. Real-time Data Updates

#### Live Chat with Persistence

```javascript
// src/socketIo/components/ChatArea.js
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../SocketProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import chatService from "../../services/chatService";

const ChatArea = ({ roomId }) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch chat history
  const { data: messages = [] } = useQuery({
    queryKey: ["chat-messages", roomId],
    queryFn: () => chatService.getChatHistory(roomId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onMutate: async newMessage => {
      await queryClient.cancelQueries(["chat-messages", roomId]);

      const previousMessages = queryClient.getQueryData(["chat-messages", roomId]);

      // Optimistically add message
      queryClient.setQueryData(["chat-messages", roomId], old => [
        ...old,
        { ...newMessage, id: Date.now(), pending: true },
      ]);

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(["chat-messages", roomId], context.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["chat-messages", roomId]);
    },
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("new-message", message => {
      if (message.roomId === roomId) {
        queryClient.setQueryData(["chat-messages", roomId], old => [...old, message]);
      }
    });

    // Listen for typing indicators
    socket.on("user-typing", data => {
      if (data.roomId === roomId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
    };
  }, [socket, roomId, queryClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.pending ? "pending" : ""}`}>
            <span className="user">{message.user}</span>
            <span className="text">{message.text}</span>
            <span className="time">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Someone is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
```

## 🛠️ Error Handling

### 1. Global Error Boundary

```javascript
// src/components/ErrorBoundary.js
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // errorTracking.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. API Error Handling

```javascript
// src/services/api.js
import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Global error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || "An error occurred";

    // Handle different error types
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("authToken");
        window.location.href = "/signin";
        break;
      case 403:
        // Forbidden - show access denied
        toast.error("Access denied");
        break;
      case 404:
        // Not found
        toast.error("Resource not found");
        break;
      case 500:
        // Server error
        toast.error("Server error. Please try again later.");
        break;
      default:
        // Other errors
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

## 📊 Performance Monitoring

### 1. API Performance Tracking

```javascript
// src/utils/performance.js
export const trackApiCall = (endpoint, duration, status) => {
  // Send to analytics service
  if (process.env.NODE_ENV === "production") {
    analytics.track("api_call", {
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    });
  }
};

// API interceptor with performance tracking
api.interceptors.request.use(
  config => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    const duration = new Date() - response.config.metadata.startTime;
    trackApiCall(response.config.url, duration, response.status);
    return response;
  },
  error => {
    const duration = new Date() - error.config.metadata.startTime;
    trackApiCall(error.config.url, duration, error.response?.status || "error");
    return Promise.reject(error);
  }
);
```

## 🔧 Development Tools

### 1. Environment Configuration

```javascript
// .env.development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development

// .env.production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_SOCKET_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

### 2. Development Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev:server": "cd ../backend && npm run dev",
    "dev:full": "concurrently \"npm run dev:server\" \"npm start\""
  }
}
```

## 📋 Integration Checklist

### Frontend Setup

- [ ] API service layer configured
- [ ] React Query setup with proper caching
- [ ] Socket.IO client integration
- [ ] Authentication context with Firebase
- [ ] Error boundaries implemented
- [ ] Loading states and error handling
- [ ] Environment variables configured

### Backend Integration

- [ ] CORS configuration for frontend domain
- [ ] Authentication middleware
- [ ] Socket.IO server setup
- [ ] API rate limiting
- [ ] Error handling middleware
- [ ] Logging and monitoring
- [ ] Database connection pooling

### Real-time Features

- [ ] Socket.IO connection management
- [ ] Room-based messaging
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Message persistence
- [ ] File sharing support
- [ ] Emoji support

### Security

- [ ] JWT token validation
- [ ] CORS policy configuration
- [ ] Input validation and sanitization
- [ ] Rate limiting implementation
- [ ] HTTPS enforcement
- [ ] XSS protection
- [ ] CSRF protection

---

## 📞 Support

For integration issues or questions:

- **API Documentation**: Check backend API docs
- **Socket.IO Docs**: Official Socket.IO documentation
- **React Query Docs**: TanStack Query documentation
- **Firebase Docs**: Firebase Authentication guide

---

_Last updated: December 2024_
