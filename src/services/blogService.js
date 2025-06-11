import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("firebaseToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const blogService = {
  // Create new blog post
  createBlog: async blogData => {
    try {
      const response = await api.post("/blogs", blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all blogs with pagination and search
  getBlogs: async ({ page = 1, limit = 10, search = "", category = "" }) => {
    try {
      const response = await api.get("/blogs", {
        params: { page, limit, search, category },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single blog by ID
  getBlog: async id => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update blog post
  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete blog post
  deleteBlog: async id => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add comment to blog
  addComment: async (blogId, comment) => {
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, comment);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like/Unlike blog
  likeBlog: async blogId => {
    try {
      const response = await api.post(`/blogs/${blogId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
