import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async getProfile() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateProfile(userData) {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/auth/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export { authService };
