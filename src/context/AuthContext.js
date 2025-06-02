import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Login successful!");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Registration successful!");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const createGuestUser = async ({ name = "Guest User" }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/guest`, { name });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Guest session started!");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create guest session");
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    createGuestUser,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
