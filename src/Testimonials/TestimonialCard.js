import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { toast } from "react-hot-toast";

// Add line-clamp utility styles
const lineClampStyles = `
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const TestimonialCard = ({ testimonial, onDelete, onEdit }) => {
  const { user, dbUser } = useAuth();
  const queryClient = useQueryClient();
  const isOwner = user?.email === testimonial.email;
  const isAdmin = dbUser?.role === "admin";

  // Determine which delete function to use based on user role
  const deleteMutation = useMutation({
    mutationFn: () => {
      // If user is admin, use admin delete function
      if (isAdmin) {
        return testimonialService.deleteTestimonialAdmin(testimonial._id);
      }
      // Otherwise use regular delete function
      return testimonialService.deleteTestimonial(testimonial._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
      toast.success("Testimonial deleted successfully");
      onDelete?.();
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to delete testimonial");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate();
    }
  };

  // Format date
  const formatDate = dateString => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg relative overflow-hidden"
    >
      <style>{lineClampStyles}</style>

      {/* Quote Icon Background */}
      <div className="absolute top-4 right-4 text-[var(--primary-main)] opacity-10">
        <FaQuoteLeft size={60} />
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="mb-6 relative z-10">
        <p className="text-[var(--text-primary)] italic line-clamp-4 leading-relaxed">
          "{testimonial.testimonialText}"
        </p>
        {testimonial.testimonialText.length > 300 && (
          <button
            className="text-[var(--primary-main)] text-xs mt-2 hover:underline"
            onClick={e => {
              const textElement = e.target.previousElementSibling;
              textElement.classList.toggle("line-clamp-4");
              e.target.textContent = textElement.classList.contains("line-clamp-4")
                ? "Read more"
                : "Read less";
            }}
          >
            Read more
          </button>
        )}
      </div>

      {/* Client Info with Modern Design */}
      <div className="flex items-center gap-4">
        {/* Profile Image with Modern Border */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-[var(--primary-main)] ring-offset-4 ring-offset-[var(--background-paper)] shadow-lg">
            <img
              src={testimonial.clientImageURL || "https://via.placeholder.com/150"}
              alt={testimonial.clientName}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--primary-main)] flex items-center justify-center">
            <FaQuoteLeft className="text-white text-xs" />
          </div>
        </div>

        {/* Author Info with Modern Typography */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-[var(--text-primary)] truncate">
              {testimonial.clientName}
            </h3>
            {testimonial.status === "approved" && (
              <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full flex-shrink-0">
                Approved
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--primary-main)] truncate">
              {testimonial.position}
            </p>
            <p className="text-sm text-[var(--text-secondary)] truncate">
              {testimonial.companyName}
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <FaCalendarAlt className="text-[var(--primary-main)] flex-shrink-0" />
              <span>{formatDate(testimonial.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Link */}
      {testimonial.projectLink && (
        <a
          href={testimonial.projectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-[var(--primary-main)] hover:text-[var(--primary-dark)] text-sm block truncate"
        >
          View Project →
        </a>
      )}

      {/* Admin/Owner Actions */}
      {(isOwner || isAdmin) && (
        <div className="mt-4 pt-4 border-t border-[var(--border-main)] flex justify-end gap-2">
          {(isOwner || isAdmin) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors"
            >
              Edit
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <FaTrash className="text-xs" />
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      )}

      {/* Status Badge */}
      {testimonial.status === "pending" && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full">Pending</span>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;
