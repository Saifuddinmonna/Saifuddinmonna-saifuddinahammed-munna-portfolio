import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const TestimonialModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    image: "",
    rating: 0,
    text: "",
    services: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/users/me");
      const userData = response.data;

      // Pre-fill form with user data if available
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        image: userData.profilePicture || "",
      }));
    } catch (error) {
      // If user is not logged in or there's an error, just continue with empty form
      console.log("User not logged in or error fetching user data");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.rating) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.text.trim()) {
      newErrors.text = "Comment is required";
    }

    if (!formData.services.trim()) {
      newErrors.services = "Services are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/testimonials", formData);
      toast.success(response.data.message);
      onClose();
      setFormData({
        name: "",
        role: "",
        company: "",
        image: "",
        rating: 0,
        text: "",
        services: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRatingChange = rating => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: "",
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Share Your Experience</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-2`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role/Position *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Restaurant Owner"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-2`}
                />
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company/Business Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., Kacchi Bhai Restaurant"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.company ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-2`}
                />
                {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Services Provided *
                </label>
                <input
                  type="text"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  placeholder="e.g., Restaurant Website with Online Ordering"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.services ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-2`}
                />
                {errors.services && <p className="mt-1 text-sm text-red-500">{errors.services}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating *</label>
                <div className="flex space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl ${
                        formData.rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Your Comment *</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Share your experience with our services..."
                  className={`mt-1 block w-full rounded-md border ${
                    errors.text ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-2`}
                />
                {errors.text && <p className="mt-1 text-sm text-red-500">{errors.text}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture URL (Optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialModal;
