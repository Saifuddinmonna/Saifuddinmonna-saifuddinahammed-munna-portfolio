import axios from "axios";
import { BASE_API_URL } from "../../utils/apiConfig";

const authService = {
  async login(email, password) {
    const response = await axios.post(`${BASE_API_URL}/api/auth/login`, { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${BASE_API_URL}/api/auth/register`, userData);
    return response.data;
  },

  async getProfile() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateProfile(userData) {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_API_URL}/api/auth/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export { authService };
