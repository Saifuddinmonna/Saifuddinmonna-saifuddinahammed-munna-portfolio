import axios from "axios";
import { getAuthToken, handleAuthError } from "../auth/utils/api";

import { API_URL } from "../ApiForChangingTesting";

const testimonialService = {
  // Get public testimonials (no auth required)
  getPublicTestimonials: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/testimonials/public`);
      console.log("akhane public testomonial test korsi ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching public testimonials:", error);
      throw error;
    }
  },

  // Get user's testimonials (auth required)
  getUserTestimonials: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.get(`${API_URL}/api/testimonials/user`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Get all testimonials (admin only)
  getAllTestimonials: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.get(`${API_URL}/api/testimonials/admin/all`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Submit new testimonial (auth required)
  submitTestimonial: async formData => {
    try {
      const token = getAuthToken();
      console.log("token from submittestimonial", token);

      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.post(`${API_URL}/api/testimonials`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Update testimonial (auth required)
  updateTestimonial: async (id, formData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.patch(`${API_URL}/api/testimonials/${id}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Delete testimonial (auth required)
  deleteTestimonial: async id => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.delete(`${API_URL}/api/testimonials/${id}`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Delete testimonial as admin (admin only)
  deleteTestimonialAdmin: async id => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.delete(`${API_URL}/api/testimonials/admin/${id}`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Update testimonial status (admin only)
  updateTestimonialStatus: async (id, status) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.patch(
        `${API_URL}/api/testimonials/admin/${id}/status`,
        { status },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },
};

export default testimonialService;
