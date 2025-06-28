import axios from "axios";
import { toast } from "react-toastify";

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/signin";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("Access denied. You do not have permission for this action.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  // Register new user
  register: async userData => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  // Google auth
  googleAuth: async userData => {
    const response = await api.post("/api/auth/google", userData);
    return response.data;
  },

  // Update user profile
  updateProfile: async userData => {
    const response = await api.put("/api/auth/profile", userData);
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get("/api/auth/verify-token");
    return response.data;
  },
};

// Blog API functions
export const blogAPI = {
  // Get all blogs
  getAllBlogs: async (params = {}) => {
    const response = await api.get("/api/blogs", { params });
    return response.data;
  },

  // Get single blog
  getBlog: async id => {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  },

  // Create blog
  createBlog: async blogData => {
    const response = await api.post("/api/blogs", blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/api/blogs/${id}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async id => {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  },
};

// Testimonials API functions
export const testimonialsAPI = {
  // Get all testimonials
  getAllTestimonials: async (params = {}) => {
    const response = await api.get("/api/testimonials", { params });
    return response.data;
  },

  // Get single testimonial
  getTestimonial: async id => {
    const response = await api.get(`/api/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial
  createTestimonial: async testimonialData => {
    const response = await api.post("/api/testimonials", testimonialData);
    return response.data;
  },

  // Update testimonial
  updateTestimonial: async (id, testimonialData) => {
    const response = await api.put(`/api/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async id => {
    const response = await api.delete(`/api/testimonials/${id}`);
    return response.data;
  },
};

// Portfolio/My Work API functions
export const portfolioAPI = {
  // Get all portfolios
  getAllPortfolios: async (params = {}) => {
    const response = await api.get("/api/portfolios", { params });
    return response.data;
  },

  // Get single portfolio
  getPortfolio: async id => {
    const response = await api.get(`/api/portfolios/${id}`);
    return response.data;
  },

  // Create portfolio
  createPortfolio: async portfolioData => {
    const response = await api.post("/api/portfolios", portfolioData);
    return response.data;
  },

  // Update portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await api.put(`/api/portfolios/${id}`, portfolioData);
    return response.data;
  },

  // Delete portfolio
  deletePortfolio: async id => {
    const response = await api.delete(`/api/portfolios/${id}`);
    return response.data;
  },
};

// Gallery API functions
export const galleryAPI = {
  // Get all gallery items
  getAllGalleryItems: async (params = {}) => {
    const response = await api.get("/api/gallery", { params });
    return response.data;
  },

  // Get single gallery item
  getGalleryItem: async id => {
    const response = await api.get(`/api/gallery/${id}`);
    return response.data;
  },

  // Create gallery item
  createGalleryItem: async galleryData => {
    const response = await api.post("/api/gallery", galleryData);
    return response.data;
  },

  // Update gallery item
  updateGalleryItem: async (id, galleryData) => {
    const response = await api.put(`/api/gallery/${id}`, galleryData);
    return response.data;
  },

  // Delete gallery item
  deleteGalleryItem: async id => {
    const response = await api.delete(`/api/gallery/${id}`);
    return response.data;
  },

  // Upload image
  uploadImage: async file => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/api/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (params = {}) => {
    const response = await api.get("/api/dashboard/activities", { params });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Handle file upload
  uploadFile: async (file, endpoint = "/api/upload") => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Handle multiple file upload
  uploadMultipleFiles: async (files, endpoint = "/api/upload/multiple") => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
