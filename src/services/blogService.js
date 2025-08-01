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

// Add response interceptor for logging
// api.interceptors.response.use(
//   response => {
//     console.log("API Response:", response.data);
//     return response.data;
//   },
//   error => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export const blogService = {
  // Get all blogs with pagination and filters
  getAllBlogs: async ({ page = 1, limit = 10, search = "", category = "" }) => {
    try {
      console.log(
        "🔍 API Call - page:",
        page,
        "limit:",
        limit,
        "search:",
        search,
        "category:",
        category
      );
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search && search.trim()) {
        params.append("search", search.trim());
        console.log("🔍 Adding search parameter:", search.trim());
      }
      if (category && category.trim()) {
        params.append("category", category.trim());
        console.log("🔍 Adding category parameter:", category.trim());
      }

      const response = await api.get(`/api/blogs?${params.toString()}`);
      console.log("🔍 API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
  },

  // Get single blog post by ID
  getBlog: async id => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      // Return the actual data, not the full response
      return response.data;
    } catch (error) {
      console.error("Error fetching blog:", error);
      console.error("Error response:", error.response);
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

  // Get blogs by category ID
  getBlogsByCategory: async (categoryId, { page = 1, limit = 10, search = "" } = {}) => {
    try {
      console.log("Fetching blogs for category:", categoryId);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        category: categoryId,
      });

      if (search) params.append("search", search);

      const response = await api.get(`/api/blogs?${params.toString()}`);
      console.log("Blogs by category response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blogs by category");
    }
  },

  // Get blogs by category ID with pagination
  getBlogsByCategoryPaginated: async (categoryId, page = 1, limit = 10) => {
    try {
      console.log("Fetching paginated blogs for category:", categoryId, "page:", page);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        category: categoryId,
      });

      const response = await api.get(`/api/blogs?${params.toString()}`);
      console.log("Paginated blogs by category response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated blogs by category:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch paginated blogs by category"
      );
    }
  },
};
