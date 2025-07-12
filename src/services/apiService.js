import axios from "axios";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../utils/apiConfig";
import MyProjectWorksList from "../components/features/adminDashboard/MyProjectWorksList";

// API Configuration
const baseURL = BASE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
  timeout: 7000, // Default timeout for regular requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for file uploads with longer timeout
const uploadApi = axios.create({
  baseURL: baseURL,
  timeout: 300000, // 5 minutes for large file uploads
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Create axios instance for resume operations with medium timeout
const resumeApi = axios.create({
  baseURL: baseURL,
  timeout: 45000, // 13 seconds for resume operations
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Request interceptor for resume API
resumeApi.interceptors.request.use(
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

// Response interceptor for resume API
resumeApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ECONNABORTED") {
      toast.error("Resume operation timeout. Please try again.");
    } else if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/signin";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 413) {
      toast.error("File too large. Please use a smaller file.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error during resume operation. Please try again later.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Resume operation failed. Please try again.");
    }
    return Promise.reject(error);
  }
);

// Request interceptor for upload API
uploadApi.interceptors.request.use(
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

// Response interceptor for upload API
uploadApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ECONNABORTED") {
      toast.error("Upload timeout. Please try again with a smaller file or check your connection.");
    } else if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/signin";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 413) {
      toast.error("File too large. Please use a smaller file.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error during upload. Please try again later.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Upload failed. Please try again.");
    }
    return Promise.reject(error);
  }
);

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

  // Delete blog image
  deleteBlogImage: async (id, imageObject) => {
    const response = await api.put(`/api/blogs/${id}/delete-image`, {
      image: imageObject,
    });
    return response.data;
  },
};

// Create blog (multipart/form-data)
export const createBlogMultipart = async formData => {
  try {
    console.log("=== CREATING BLOG MULTIPART ===");
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value === "object" ? `File: ${value.name}` : value);
    }

    // Create a separate axios instance for multipart requests
    const multipartApi = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      // Do NOT set Content-Type header for FormData
    });

    // Add auth token to multipart requests
    const token = localStorage.getItem("authToken");
    if (token) {
      multipartApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    console.log("=== REQUEST DETAILS ===");
    console.log("URL:", `${baseURL}/api/blogs`);
    console.log("Method: POST");
    console.log("Content-Type will be set by browser for FormData");
    console.log("========================");

    const response = await multipartApi.post("/api/blogs", formData);

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Blog creation error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    throw error;
  }
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

// Resume API functions
export const resumeAPI = {
  // Get all resumes (with pagination, filter, search)
  getAllResumes: async (params = {}) => {
    const response = await resumeApi.get("/api/resumes", { params });
    return response.data;
  },

  // Get single resume by ID
  getResume: async id => {
    const response = await api.get(`/api/resumes/${id}`);
    return response.data;
  },

  // Create new resume (with file upload)
  createResume: async resumeData => {
    try {
      console.log("[Resume API] Creating resume with data:", Object.keys(resumeData));

      const formData = new FormData();

      // Append text fields
      if (resumeData.name) formData.append("name", resumeData.name);
      if (resumeData.versionName) formData.append("versionName", resumeData.versionName);
      if (resumeData.summary) formData.append("summary", resumeData.summary);
      if (resumeData.forWhichPost) formData.append("forWhichPost", resumeData.forWhichPost);
      if (resumeData.originalCreationDate)
        formData.append("originalCreationDate", resumeData.originalCreationDate);
      if (resumeData.textContent) formData.append("textContent", resumeData.textContent);

      // Append arrays as JSON strings
      if (resumeData.suitableFor)
        formData.append("suitableFor", JSON.stringify(resumeData.suitableFor));
      if (resumeData.tags) formData.append("tags", JSON.stringify(resumeData.tags));

      // Append boolean
      if (resumeData.isActive !== undefined)
        formData.append("isActive", JSON.stringify(resumeData.isActive));

      // Append files
      if (resumeData.pdfFile) {
        console.log("[Resume API] Adding PDF file:", resumeData.pdfFile.name);
        formData.append("pdfFile", resumeData.pdfFile);
      }
      if (resumeData.docxFile) {
        console.log("[Resume API] Adding DOCX file:", resumeData.docxFile.name);
        formData.append("docxFile", resumeData.docxFile);
      }
      if (resumeData.videoFile) {
        console.log("[Resume API] Adding Video file:", resumeData.videoFile.name);
        formData.append("videoFile", resumeData.videoFile);
      }

      console.log(
        "[Resume API] FormData entries:",
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          typeof value === "object" ? value.name || "File" : value,
        ])
      );

      const response = await resumeApi.post("/api/resumes", formData);
      console.log("[Resume API] Create response:", response.data);

      // Show success toast
      toast.success("✅ Resume created successfully!");

      return response.data;
    } catch (error) {
      console.error("[Resume API] Create error:", error);

      // Show error toast
      if (error.response?.data?.message) {
        toast.error(`❌ Failed to create resume: ${error.response.data.message}`);
      } else {
        toast.error("❌ Failed to create resume. Please try again.");
      }

      throw error;
    }
  },

  // Update resume (with file upload)
  updateResume: async (id, resumeData) => {
    try {
      console.log("[Resume API] Updating resume with ID:", id);
      console.log("[Resume API] Update data keys:", Object.keys(resumeData));

      const formData = new FormData();

      // Append text fields
      if (resumeData.name) formData.append("name", resumeData.name);
      if (resumeData.versionName) formData.append("versionName", resumeData.versionName);
      if (resumeData.summary) formData.append("summary", resumeData.summary);
      if (resumeData.forWhichPost) formData.append("forWhichPost", resumeData.forWhichPost);
      if (resumeData.originalCreationDate)
        formData.append("originalCreationDate", resumeData.originalCreationDate);
      if (resumeData.textContent) formData.append("textContent", resumeData.textContent);

      // Append arrays as JSON strings
      if (resumeData.suitableFor)
        formData.append("suitableFor", JSON.stringify(resumeData.suitableFor));
      if (resumeData.tags) formData.append("tags", JSON.stringify(resumeData.tags));

      // Append boolean
      if (resumeData.isActive !== undefined)
        formData.append("isActive", JSON.stringify(resumeData.isActive));

      // Append files
      if (resumeData.pdfFile) {
        console.log("[Resume API] Adding PDF file:", resumeData.pdfFile.name);
        formData.append("pdfFile", resumeData.pdfFile);
      }
      if (resumeData.docxFile) {
        console.log("[Resume API] Adding DOCX file:", resumeData.docxFile.name);
        formData.append("docxFile", resumeData.docxFile);
      }
      if (resumeData.videoFile) {
        console.log("[Resume API] Adding Video file:", resumeData.videoFile.name);
        formData.append("videoFile", resumeData.videoFile);
      }

      const response = await resumeApi.put(`/api/resumes/${id}`, formData);
      console.log("[Resume API] Update response:", response.data);

      // Show success toast
      toast.success("✅ Resume updated successfully!");

      return response.data;
    } catch (error) {
      console.error("[Resume API] Update error:", error);

      // Show error toast
      if (error.response?.data?.message) {
        toast.error(`❌ Failed to update resume: ${error.response.data.message}`);
      } else {
        toast.error("❌ Failed to update resume. Please try again.");
      }

      throw error;
    }
  },

  // Delete resume
  deleteResume: async id => {
    try {
      const response = await api.delete(`/api/resumes/${id}`);

      // Show success toast
      toast.success("✅ Resume deleted successfully!");

      return response.data;
    } catch (error) {
      console.error("[Resume API] Delete error:", error);

      // Show error toast
      if (error.response?.data?.message) {
        toast.error(`❌ Failed to delete resume: ${error.response.data.message}`);
      } else {
        toast.error("❌ Failed to delete resume. Please try again.");
      }

      throw error;
    }
  },

  // Toggle resume active status
  toggleResumeStatus: async id => {
    try {
      const response = await api.patch(`/api/resumes/${id}/toggle-status`);

      // Show success toast
      toast.success("✅ Resume status updated successfully!");

      return response.data;
    } catch (error) {
      console.error("[Resume API] Toggle status error:", error);

      // Show error toast
      if (error.response?.data?.message) {
        toast.error(`❌ Failed to update resume status: ${error.response.data.message}`);
      } else {
        toast.error("❌ Failed to update resume status. Please try again.");
      }

      throw error;
    }
  },

  // Download PDF for a resume
  downloadResumePdf: id => {
    // Returns the full URL for downloading the PDF
    console.log("download pdf api call hosse ");
    return `${BASE_API_URL}/api/resumes/${id}/download-pdf`;
  },

  // Download DOCX for a resume
  downloadResumeDocx: id => {
    // Returns the full URL for downloading the DOCX
    console.log("download doxc api call hosse ");
    return `${BASE_API_URL}/api/resumes/${id}/download-docx`;
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

// Statistics API functions
export const statsAPI = {
  // Get all available statistics endpoints
  getStatsEndpoints: async () => {
    console.log("🔍 [Stats API] Calling getStatsEndpoints...");
    try {
      const response = await api.get("/api/stats");
      console.log("✅ [Stats API] getStatsEndpoints Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Stats API] getStatsEndpoints Error:", error);
      throw error;
    }
  },

  // Get all collections document counts
  getAllCounts: async () => {
    console.log("🔍 [Stats API] Calling getAllCounts...");
    try {
      const response = await api.get("/api/stats/counts");
      console.log("✅ [Stats API] getAllCounts Response:", response.data);
      console.log("📊 [Stats API] Response structure:", {
        success: response.data.success,
        message: response.data.message,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : [],
        collections: response.data.data?.collections
          ? Object.keys(response.data.data.collections)
          : [],
      });

      // Fix: Handle different response structures
      let processedData = response.data;

      // If response has data property, use it
      if (response.data.data) {
        processedData = {
          success: response.data.success,
          message: response.data.message,
          data: response.data.data,
        };
      }
      // If response is direct data (no data wrapper)
      else if (response.data.success === undefined) {
        processedData = {
          success: true,
          message: "Statistics retrieved successfully",
          data: {
            totalCollections: Object.keys(response.data).length,
            collections: response.data,
            timestamp: new Date().toISOString(),
          },
        };
      }

      console.log("🔧 [Stats API] Processed data:", processedData);
      return processedData;
    } catch (error) {
      console.error("❌ [Stats API] getAllCounts Error:", error);
      console.error("❌ [Stats API] Error response:", error.response?.data);
      console.error("❌ [Stats API] Error status:", error.response?.status);
      throw error;
    }
  },

  // Get simple counts (main collections only)
  getSimpleCounts: async () => {
    console.log("🔍 [Stats API] Calling getSimpleCounts...");
    try {
      const response = await api.get("/api/stats/simple");
      console.log("✅ [Stats API] getSimpleCounts Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Stats API] getSimpleCounts Error:", error);
      throw error;
    }
  },

  // Get detailed statistics with additional info
  getDetailedStats: async () => {
    console.log("🔍 [Stats API] Calling getDetailedStats...");
    try {
      const response = await api.get("/api/stats/detailed");
      console.log("✅ [Stats API] getDetailedStats Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Stats API] getDetailedStats Error:", error);
      throw error;
    }
  },

  // Get real-time statistics
  getRealTimeStats: async () => {
    console.log("🔍 [Stats API] Calling getRealTimeStats...");
    try {
      const response = await api.get("/api/stats/realtime");
      console.log("✅ [Stats API] getRealTimeStats Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Stats API] getRealTimeStats Error:", error);
      throw error;
    }
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

// Blog Category API functions
export const blogCategoryAPI = {
  // Get all categories (flat)
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },
  // Get all categories as tree
  getCategoryTree: async () => {
    const response = await api.get("/api/categories/tree");
    return response.data;
  },
  // Create category
  createCategory: async data => {
    const response = await api.post("/api/categories", data);
    return response.data;
  },
  // Update category
  updateCategory: async (id, data) => {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },
  // Delete category
  deleteCategory: async id => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },
};

export default api;
export const getAllPortfolioProjects = myProjectWorksAPI.getAllProjectWorks;
export const getPortfolioProject = myProjectWorksAPI.getProjectWork;
export const getAllCategories = myProjectWorksAPI.getAllCategories;
export const getProjectWork = myProjectWorksAPI.getProjectWork;
export const resumeApiPdf = resumeAPI.downloadResumePdf;
export const resumeApiDoxc = resumeAPI.downloadResumeDocx;
export const deleteBlogImage = blogAPI.deleteBlogImage;

// Dashboard data functions
export const getBlogs = async () => {
  console.log("🔍 [Dashboard API] Calling getBlogs...");
  try {
    const response = await api.get("/api/blogs");
    console.log("✅ [Dashboard API] getBlogs Response:", response.data);
    return response.data;
  } catch (error) {
    console.warn("❌ [Dashboard API] Blogs API error:", error.message);
    console.warn("❌ [Dashboard API] Blogs error details:", error.response?.data);
    // Return empty data instead of throwing error
    return { data: [] };
  }
};

export const getTestimonials = async () => {
  console.log("🔍 [Dashboard API] Calling getTestimonials...");
  try {
    const response = await api.get("/api/testimonials/admin/all");
    console.log("✅ [Dashboard API] getTestimonials Response:", response.data);
    return response.data;
  } catch (error) {
    console.warn("❌ [Dashboard API] Testimonials API error:", error.message);
    console.warn("❌ [Dashboard API] Testimonials error details:", error.response?.data);
    // Return empty data instead of throwing error
    return { data: [] };
  }
};

export const getCategories = async () => {
  console.log("🔍 [Dashboard API] Calling getCategories...");
  try {
    const response = await api.get("/api/categories");
    console.log("✅ [Dashboard API] getCategories Response:", response.data);
    return response.data;
  } catch (error) {
    console.warn("❌ [Dashboard API] Categories API error:", error.message);
    console.warn("❌ [Dashboard API] Categories error details:", error.response?.data);
    // Return empty data instead of throwing error
    return { data: [] };
  }
};

export const getResumes = async () => {
  console.log("🔍 [Dashboard API] Calling getResumes...");
  try {
    const response = await api.get("/api/resumes");
    console.log("✅ [Dashboard API] getResumes Response:", response.data);
    return response.data;
  } catch (error) {
    console.warn("❌ [Dashboard API] Resumes API error:", error.message);
    console.warn("❌ [Dashboard API] Resumes error details:", error.response?.data);
    // Return empty data instead of throwing error
    return { data: [] };
  }
};

// Stats convenience functions
export const getStatsEndpoints = statsAPI.getStatsEndpoints;
export const getAllCounts = statsAPI.getAllCounts;
export const getSimpleCounts = statsAPI.getSimpleCounts;
export const getDetailedStats = statsAPI.getDetailedStats;
export const getRealTimeStats = statsAPI.getRealTimeStats;
