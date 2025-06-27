import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../utils/apiConfig";

const API_BASE_URL = API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("authToken");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

// Example API functions
export const verifyToken = async () => {
  return apiRequest("/auth/verify-token");
};

// Fetches a single user's profile from the database (e.g., /api/users/profile)
// This should be updated if /api/users/profile is for all users
// export const getUserProfile = async () => {
//   return apiRequest("/user/profile");
// };

// New function to get the current logged-in user's profile from /api/auth/me
export const getCurrentUserProfile = async () => {
  try {
    const profile = await apiRequest("/api/auth/me");
    console.log("getCurrentUserProfile response:", profile);
    return profile;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};

console.log("db user from heere", getCurrentUserProfile);
export const updateUserProfile = async data => {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Auth utility functions
export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : null;
};

export const handleAuthError = error => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  throw error;
};

// API instance with auth interceptor
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    handleAuthError(error);
    return Promise.reject(error);
  }
);

export default api;
