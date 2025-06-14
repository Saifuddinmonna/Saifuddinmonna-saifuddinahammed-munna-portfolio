import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { toast } from "react-hot-toast";
import { FaStar, FaImage } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";

const TestimonialForm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    testimonialText: "",
    companyName: "",
    position: "",
    rating: 5,
    projectLink: "",
    clientImageUrlInput: "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Set default email and name when user is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        clientName: user.displayName || user.email?.split("@")[0] || "",
      }));
    }
  }, [user]);

  const submitMutation = useMutation({
    mutationFn: data => testimonialService.submitTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
      toast.success("Testimonial submitted successfully! It will be visible after approval.");
      resetForm();
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to submit testimonial");
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.testimonialText) newErrors.testimonialText = "Testimonial text is required";
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (formData.rating < 1 || formData.rating > 5)
      newErrors.rating = "Rating must be between 1 and 5";

    // Validate image URL if provided
    if (formData.clientImageUrlInput && !isValidImageUrl(formData.clientImageUrlInput)) {
      newErrors.clientImageUrlInput = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = url => {
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    } catch {
      return false;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a testimonial");
      return;
    }
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (image) {
      formDataToSend.append("clientImageFile", image);
    }

    submitMutation.mutate(formDataToSend);
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      testimonialText: "",
      companyName: "",
      position: "",
      rating: 5,
      projectLink: "",
      clientImageUrlInput: "",
    }));
    setImage(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Update image preview when URL changes
    if (name === "clientImageUrlInput" && value) {
      if (isValidImageUrl(value)) {
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleImageChange = e => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create preview for uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setFormData(prev => ({
        ...prev,
        clientImageUrlInput: "",
      }));
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6 bg-[var(--background-paper)] rounded-lg shadow-lg">
        <p className="text-[var(--text-primary)]">Please login to submit a testimonial.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-[var(--background-paper)] rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Share Your Experience</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-[var(--text-primary)] mb-2">Name *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
            readOnly
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="text-2xl"
              >
                <FaStar className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Your Testimonial *</label>
          <textarea
            name="testimonialText"
            value={formData.testimonialText}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
          />
          {errors.testimonialText && (
            <p className="text-red-500 text-sm mt-1">{errors.testimonialText}</p>
          )}
        </div>

        <div>
          <label className="block text-[var(--text-primary)] mb-2">Project Link (Optional)</label>
          <input
            type="url"
            name="projectLink"
            value={formData.projectLink}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
          />
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-[var(--text-primary)] mb-2">Your Photo</label>
            <div className="flex flex-col gap-4">
              {/* Image URL Input */}
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Or provide an image URL
                </label>
                <input
                  type="url"
                  name="clientImageUrlInput"
                  value={formData.clientImageUrlInput}
                  onChange={handleInputChange}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
                />
                {errors.clientImageUrlInput && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientImageUrlInput}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Or upload an image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg cursor-pointer hover:bg-[var(--primary-dark)] transition-colors duration-300">
                    <FaImage />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {image && <span className="text-[var(--text-secondary)]">{image.name}</span>}
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-[var(--border-main)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitMutation.isLoading}
          className="w-full py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300 disabled:opacity-50"
        >
          {submitMutation.isLoading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;
