import axios from "axios";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../utils/apiConfig";

// API Configuration
const baseURL = BASE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
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

// Auth utility functions (merged from auth/utils/api.js)
export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : null;
};

export const handleAuthError = error => {
  if (error.response?.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }
  throw error;
};

// Generic API request function (merged from auth/utils/api.js)
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("authToken");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${baseURL}${endpoint}`, {
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

// Get current user profile (merged from auth/utils/api.js)
export const getCurrentUserProfile = async () => {
  try {
    const profile = await apiRequest("/api/auth/me");
    console.log("getCurrentUserProfile response:", profile);
    return profile;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
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

// MyProjectWorks API functions
export const myProjectWorksAPI = {
  // Get all project works with pagination
  getAllProjectWorks: async (params = {}) => {
    try {
      console.log("Calling API with params:", params);
      const response = await api.get("/api/my-project-works", { params });
      console.log("API Response:", response);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Get single project work
  getProjectWork: async id => {
    const response = await api.get(`/api/my-project-works/${id}`);
    return response.data;
  },

  // Create new project work
  createProjectWork: async projectData => {
    const response = await api.post("/api/my-project-works", projectData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update project work
  updateProjectWork: async (id, projectData) => {
    const response = await api.put(`/api/my-project-works/${id}`, projectData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete project work
  deleteProjectWork: async id => {
    const response = await api.delete(`/api/my-project-works/${id}`);
    return response.data;
  },

  // Delete single image from project work
  deleteProjectWorkImage: async (projectId, imageId) => {
    const response = await api.delete(`/api/my-project-works/${projectId}/images/${imageId}`);
    return response.data;
  },

  // Delete single documentation from project work
  deleteProjectWorkDoc: async (projectId, docId) => {
    const response = await api.delete(`/api/my-project-works/${projectId}/docs/${docId}`);
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
