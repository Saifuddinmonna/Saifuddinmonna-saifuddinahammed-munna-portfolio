import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: credentials => api.post("/auth/login", credentials),
  register: userData => api.post("/auth/register", userData),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Testimonial Services
export const testimonialService = {
  getAll: () => api.get("/testimonials"),
  create: data => api.post("/testimonials", data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: id => api.delete(`/testimonials/${id}`),
};

// Chat Services
export const chatService = {
  getMessages: roomId => api.get(`/messages/${roomId}`),
  sendMessage: message => api.post("/messages", message),
  getRooms: () => api.get("/rooms"),
  createRoom: roomData => api.post("/rooms", roomData),
};

// User Services
export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: data => api.put("/users/profile", data),
  getAllUsers: () => api.get("/users"),
  getUserById: id => api.get(`/users/${id}`),
};

// Error handling
export const handleApiError = error => {
  if (error.response) {
    // Server responded with error
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 503,
      message: "Server is not responding",
    };
  } else {
    // Other errors
    return {
      status: 500,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export default api;
