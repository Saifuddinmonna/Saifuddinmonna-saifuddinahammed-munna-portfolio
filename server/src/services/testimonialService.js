import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get public testimonials (no auth required)
export const getPublicTestimonials = async () => {
  try {
    const response = await axios.get(`${API_URL}/testimonials/public`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user testimonials (requires auth)
export const getUserTestimonials = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/testimonials/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Submit new testimonial (no auth required)
export const submitTestimonial = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/testimonials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update testimonial (requires auth)
export const updateTestimonial = async (id, formData, token) => {
  try {
    const response = await axios.patch(`${API_URL}/testimonials/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete testimonial (requires auth)
export const deleteTestimonial = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/testimonials/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Get all testimonials
export const getAllTestimonials = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/testimonials/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Update testimonial status
export const updateTestimonialStatus = async (id, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/testimonials/admin/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin: Delete any testimonial
export const adminDeleteTestimonial = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/testimonials/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 