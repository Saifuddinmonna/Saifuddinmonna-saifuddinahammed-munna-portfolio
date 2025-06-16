import axios from "axios";

import { API_URL } from "../../ApiForChangingTesting";

export const blogService = {
  // Get all blog posts
  getAllPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/blog`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  },

  // Get a single blog post
  getPost: async id => {
    try {
      const response = await axios.get(`${API_URL}/blog/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      throw error;
    }
  },

  // Create a new blog post
  createPost: async postData => {
    try {
      const response = await axios.post(`${API_URL}/blog`, postData);
      return response.data;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  },

  // Update a blog post
  updatePost: async (id, postData) => {
    try {
      const response = await axios.put(`${API_URL}/blog/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  },

  // Delete a blog post
  deletePost: async id => {
    try {
      const response = await axios.delete(`${API_URL}/blog/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  },
};
