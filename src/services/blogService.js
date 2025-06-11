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
    const response = await api.post("/blogs", blogData);
    console.log("Responsefrom creaate data", response.data);
    return response.data;
  },

  // Get all blogs with pagination and search
  getBlogs: async ({ page = 1, limit = 10, search = "", category = "" }) => {
    const response = await api.get("/blogs", {
      params: { page, limit, search, category },
    });
    return response.data;
  },

  // Get single blog by ID
  getBlogById: async id => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Update blog post
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  // Delete blog post
  deleteBlog: async id => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Add comment to blog
  addComment: async (blogId, comment) => {
    const response = await api.post(`/blogs/${blogId}/comments`, comment);
    return response.data;
  },

  // Like/Unlike blog
  toggleLike: async blogId => {
    const response = await api.post(`/blogs/${blogId}/like`);
    return response.data;
  },
};
