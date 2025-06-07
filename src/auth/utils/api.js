import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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

export const getUserProfile = async () => {
  return apiRequest("/user/profile");
};

export const updateUserProfile = async data => {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
