import axios from "axios";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../utils/apiConfig";
import MyProjectWorksList from "../components/features/adminDashboard/MyProjectWorksList";

// API Configuration
const baseURL = BASE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
  timeout: 7000,
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
      console.log("🔍 [API] Calling getAllProjectWorks with params:", params);
      console.log("🔍 [API] Base URL:", baseURL);
      console.log("🔍 [API] Full URL:", `${baseURL}/api/my-project-works`);

      const response = await api.get("/api/my-project-works", { params });
      console.log("✅ [API] getAllProjectWorks Response:", response);
      console.log("✅ [API] Response data:", response.data);
      console.log("✅ [API] Response status:", response.status);

      // Handle different response structures
      let result = response.data;

      // If response.data is the array directly
      if (Array.isArray(response.data)) {
        result = {
          data: response.data,
          totalItems: response.data.length,
          totalPages: "" || 1,
          currentPage: "" || 1,
        };
      }

      // If response.data has a data property with works array (your backend format)
      else if (
        response.data &&
        response.data.data &&
        response.data.data.works &&
        Array.isArray(response.data.data.works)
      ) {
        console.log("✅ [API] Found works array in nested data structure");
        result = {
          data: response.data.data.works,
          totalItems: response.data.data.pagination?.totalItems || response.data.data.works.length,
          totalPages: response.data.data.pagination?.totalPages || 1,
          currentPage: response.data.data.pagination?.currentPage || 1,
        };
      }

      // If response.data has a data property
      else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        result = {
          data: response.data.data,
          totalItems: response.data.totalItems || response.data.data.length,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
        };
      }

      // If response.data has a projects property
      else if (response.data && response.data.projects && Array.isArray(response.data.projects)) {
        result = {
          data: response.data.projects,
          totalItems: response.data.totalItems || response.data.projects.length,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
        };
      }

      // If response.data is a single object, wrap it in array
      else if (response.data && response.data._id) {
        result = {
          data: [response.data],
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
        };
      }

      // If response is empty or null
      else {
        console.log("⚠️ [API] No valid data structure found in response");
        result = {
          data: [],
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        };
      }

      console.log("✅ [API] Processed result:", result);
      return result;
    } catch (error) {
      console.error("❌ [API] getAllProjectWorks Error:", error);
      console.error("❌ [API] Error response:", error.response);
      console.error("❌ [API] Error message:", error.message);

      if (error.response?.status === 404) {
        console.error("❌ [API] Endpoint not found - check if backend server is running");
        throw new Error("API endpoint not found. Please check if the backend server is running.");
      }

      if (error.response?.status === 401) {
        console.error("❌ [API] Unauthorized - check authentication");
        throw new Error("Authentication required. Please login again.");
      }

      throw error;
    }
  },

  // Get single project work
  getProjectWork: async id => {
    try {
      console.log("🔍 [API] Calling getProjectWork with ID:", id);
      const response = await api.get(`/api/my-project-works/${id}`);
      console.log("✅ [API] getProjectWork Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] getProjectWork Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
  },
  getAllCategories: async param => {
    try {
      const response = await api.get("/api/my-project-works/allCategories");
      console.log(
        "✅ [API] getallCategories  Response gerAllCategories in apiService:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ [API] getall categories  Error:", error);
      console.error("❌ [API] Error responsefrom all categories:", error.response);
      throw error;
    }
  },

  // Create new project work
  createProjectWork: async projectData => {
    try {
      console.log("🔍 [API] Calling createProjectWork");
      console.log("🔍 [API] Project data keys:", Object.keys(projectData));

      const response = await api.post("/api/my-project-works", projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ [API] createProjectWork Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] createProjectWork Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
  },

  // Update project work
  updateProjectWork: async (id, projectData) => {
    try {
      console.log("🔍 [API] Calling updateProjectWork with ID:", id);
      console.log("🔍 [API] Project data keys:", Object.keys(projectData));

      const response = await api.put(`/api/my-project-works/${id}`, projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ [API] updateProjectWork Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] updateProjectWork Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
  },

  // Delete project work
  deleteProjectWork: async id => {
    try {
      console.log("🔍 [API] Calling deleteProjectWork with ID:", id);
      const response = await api.delete(`/api/my-project-works/${id}`);
      console.log("✅ [API] deleteProjectWork Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] deleteProjectWork Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
  },

  // Delete single image from project work
  deleteProjectWorkImage: async (projectId, imageId) => {
    try {
      console.log("🔍 [API] Calling deleteProjectWorkImage:", { projectId, imageId });
      const response = await api.delete(`/api/my-project-works/${projectId}/images/${imageId}`);
      console.log("✅ [API] deleteProjectWorkImage Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] deleteProjectWorkImage Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
  },

  // Delete single documentation from project work
  deleteProjectWorkDoc: async (projectId, docId) => {
    try {
      console.log("🔍 [API] Calling deleteProjectWorkDoc:", { projectId, docId });
      const response = await api.delete(`/api/my-project-works/${projectId}/docs/${docId}`);
      console.log("✅ [API] deleteProjectWorkDoc Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API] deleteProjectWorkDoc Error:", error);
      console.error("❌ [API] Error response:", error.response);
      throw error;
    }
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

export const getAllPortfolioProjects = myProjectWorksAPI.getAllProjectWorks;
export const getPortfolioProject = myProjectWorksAPI.getProjectWork;
export const getAllCategories = myProjectWorksAPI.getAllCategories;
export const getProjectWork = myProjectWorksAPI.getProjectWork;

export default api;
