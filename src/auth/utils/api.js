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

// Fetches a single user's profile from the database (e.g., /api/users/profile)
// This should be updated if /api/users/profile is for all users
// export const getUserProfile = async () => {
//   return apiRequest("/user/profile");
// };

// New function to get the current logged-in user's profile from /api/auth/me
export const getCurrentUserProfile = async () => {
  return apiRequest("/auth/me");
};

console.log("db user from heere", getCurrentUserProfile);
export const updateUserProfile = async data => {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
