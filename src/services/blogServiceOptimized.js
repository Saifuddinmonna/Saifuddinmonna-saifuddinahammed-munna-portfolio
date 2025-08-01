import axios from "axios";
import { BASE_API_URL } from "../utils/apiConfig";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
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

export const blogServiceOptimized = {
  // Get all blogs with pagination and filters
  getAllBlogs: async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
    tag = "",
    status = "published",
  }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
      });

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (tag) params.append("tag", tag);

      const response = await api.get(`/api/blogs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
  },

  // Get all blogs without pagination (for featured/recent)
  getAllBlogsWithoutPagination: async ({
    search = "",
    category = "",
    tag = "",
    status = "published",
  }) => {
    try {
      const params = new URLSearchParams({ status });

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (tag) params.append("tag", tag);

      const response = await api.get(`/api/blogs/all?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs without pagination:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
  },

  // Get single blog post by ID
  getBlog: async id => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blog");
    }
  },

  // Create new blog
  createBlog: async blogData => {
    try {
      const response = await api.post("/api/blogs", blogData);
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error(error.response?.data?.message || "Failed to create blog");
    }
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/api/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw new Error(error.response?.data?.message || "Failed to update blog");
    }
  },

  // Delete blog
  deleteBlog: async id => {
    try {
      const response = await api.delete(`/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw new Error(error.response?.data?.message || "Failed to delete blog");
    }
  },

  // Like/Unlike blog
  toggleLike: async (blogId, user) => {
    try {
      const response = await api.post(`/api/blogs/${blogId}/like`, { user });
      return response.data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw new Error(error.response?.data?.message || "Failed to toggle like");
    }
  },

  // Add comment to blog
  addComment: async (blogId, comment) => {
    try {
      const response = await api.post(`/api/blogs/${blogId}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
  },

  // Update comment
  updateComment: async (blogId, commentId, commentData, userData) => {
    try {
      const response = await api.put(`/api/blogs/${blogId}/comments/${commentId}`, {
        ...commentData,
        userData: {
          email: userData.email,
          role: userData.role || "user",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw new Error(error.response?.data?.message || "Failed to update comment");
    }
  },

  // Delete comment
  deleteComment: async (blogId, commentId, userData) => {
    try {
      const response = await api.delete(`/api/blogs/${blogId}/comments/${commentId}`, {
        data: {
          userData: {
            email: userData.email,
            role: userData.role || "user",
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error(error.response?.data?.message || "Failed to delete comment");
    }
  },
};
