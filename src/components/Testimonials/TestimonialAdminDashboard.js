import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaTrash,
  FaStar,
  FaQuoteLeft,
  FaCalendarAlt,
} from "react-icons/fa";

// Add line-clamp utility styles
const lineClampStyles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const TestimonialAdminDashboard = ({ onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch all testimonials
  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: testimonialService.getAllTestimonials,
  });

  // Update testimonial status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => testimonialService.updateTestimonialStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-testimonials"]);
      onUpdate?.();
      toast.success("Testimonial status updated successfully");
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: id => testimonialService.deleteTestimonialAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-testimonials"]);
      onUpdate?.();
      toast.success("Testimonial deleted successfully");
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to delete testimonial");
    },
  });

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  // Format date
  const formatDate = dateString => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Ensure testimonials is an array and has required properties
  const testimonials = (
    Array.isArray(testimonialsData)
      ? testimonialsData
      : testimonialsData?.data
      ? testimonialsData.data
      : []
  ).map(testimonial => ({
    ...testimonial,
    clientName: testimonial.clientName || "Anonymous",
    position: testimonial.position || "Not specified",
    companyName: testimonial.companyName || "Not specified",
    testimonialText: testimonial.testimonialText || "No text provided",
    status: testimonial.status || "pending",
    rating: testimonial.rating || 0,
    createdAt: testimonial.createdAt || new Date().toISOString(),
  }));

  // Filter testimonials based on search and status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const searchTermLower = searchTerm.toLowerCase();
    const clientNameLower = (testimonial.clientName || "").toLowerCase();
    const testimonialTextLower = (testimonial.testimonialText || "").toLowerCase();
    const companyNameLower = (testimonial.companyName || "").toLowerCase();
    const positionLower = (testimonial.position || "").toLowerCase();

    const matchesSearch =
      clientNameLower.includes(searchTermLower) ||
      testimonialTextLower.includes(searchTermLower) ||
      companyNameLower.includes(searchTermLower) ||
      positionLower.includes(searchTermLower);

    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: testimonials.length || 0,
    pending: testimonials.filter(t => t.status === "pending").length || 0,
    approved: testimonials.filter(t => t.status === "approved").length || 0,
    rejected: testimonials.filter(t => t.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg">
      <style>{lineClampStyles}</style>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Admin Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total" value={stats.total} color="bg-blue-500" />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
        <StatCard title="Approved" value={stats.approved} color="bg-green-500" />
        <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
            />
            <FaSearch className="absolute left-3 top-3 text-[var(--text-secondary)]" />
          </div>
        </div>
        <div className="w-full md:w-48">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)] appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-[var(--text-secondary)]" />
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-6">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map(testimonial => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--background-default)] p-6 rounded-lg border border-[var(--border-main)] shadow-sm"
            >
              {/* Header with Status and Actions */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate">
                      {testimonial.clientName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${
                        testimonial.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : testimonial.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {testimonial.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {testimonial.position} at {testimonial.companyName}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(testimonial._id)}
                    disabled={deleteMutation.isLoading}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    <FaTrash className="text-xs" />
                    {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-[var(--text-secondary)] ml-2">
                  ({testimonial.rating}/5)
                </span>
              </div>

              {/* Testimonial Content */}
              <div className="mb-4">
                <div className="flex items-start gap-4">
                  {/* Client Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[var(--primary-main)] shadow-md">
                      <img
                        src={testimonial.clientImageURL || "https://via.placeholder.com/150"}
                        alt={testimonial.clientName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--primary-main)] flex items-center justify-center">
                      <FaQuoteLeft className="text-white text-xs" />
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)] italic line-clamp-3 leading-relaxed">
                      "{testimonial.testimonialText}"
                    </p>
                    {testimonial.testimonialText.length > 200 && (
                      <button
                        className="text-[var(--primary-main)] text-xs mt-1 hover:underline"
                        onClick={e => {
                          const textElement = e.target.previousElementSibling;
                          textElement.classList.toggle("line-clamp-3");
                          e.target.textContent = textElement.classList.contains("line-clamp-3")
                            ? "Read more"
                            : "Read less";
                        }}
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--primary-main)]" />
                  <span>{formatDate(testimonial.createdAt)}</span>
                </div>
                {testimonial.projectLink && (
                  <a
                    href={testimonial.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] hover:underline"
                  >
                    View Project →
                  </a>
                )}
              </div>

              {/* Status Management Buttons */}
              {testimonial.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: testimonial._id,
                        status: "approved",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm whitespace-nowrap"
                  >
                    <FaCheck />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: testimonial._id,
                        status: "rejected",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm whitespace-nowrap"
                  >
                    <FaTimes />
                    Reject
                  </motion.button>
                </div>
              )}
              {testimonial.status === "approved" && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: testimonial._id,
                        status: "rejected",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm whitespace-nowrap"
                  >
                    <FaTimes />
                    Reject
                  </motion.button>
                </div>
              )}
              {testimonial.status === "rejected" && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: testimonial._id,
                        status: "approved",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm whitespace-nowrap"
                  >
                    <FaCheck />
                    Approve
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-[var(--text-secondary)] py-8">
            No testimonials found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} className={`${color} rounded-lg p-4 text-white`}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default TestimonialAdminDashboard;
