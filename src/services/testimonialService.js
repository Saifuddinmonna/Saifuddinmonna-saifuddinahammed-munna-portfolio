import axios from "axios";

// Update this URL to match your backend server URL
const API_URL = "http://localhost:5000/api/testimonials"; // Assuming your backend runs on port 5000

export const testimonialService = {
  // Get all approved testimonials (public)
  getAllTestimonials: async () => {
    const response = await axios.get(API_URL);
    console.log("testomonial page thkeke ata exicute hosse :", response.data);
    return response.data;
  },

  // Submit new testimonial (public)
  submitTestimonial: async formData => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all testimonials (admin)
  getAllTestimonialsAdmin: async token => {
    const response = await axios.get(`${API_URL}/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update testimonial status (admin)
  updateTestimonialStatus: async (id, status, token) => {
    const response = await axios.patch(
      `${API_URL}/admin/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Delete testimonial (admin)
  deleteTestimonial: async (id, token) => {
    const response = await axios.delete(`${API_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
