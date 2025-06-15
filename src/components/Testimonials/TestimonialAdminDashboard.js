import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaSearch, FaFilter, FaTrash } from "react-icons/fa";

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
  }));

  // Filter testimonials based on search and status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const searchTermLower = searchTerm.toLowerCase();
    const clientNameLower = (testimonial.clientName || "").toLowerCase();
    const testimonialTextLower = (testimonial.testimonialText || "").toLowerCase();

    const matchesSearch =
      clientNameLower.includes(searchTermLower) || testimonialTextLower.includes(searchTermLower);

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
      <div className="space-y-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map(testimonial => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--background-default)] p-4 rounded-lg border border-[var(--border-main)]"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {testimonial.clientName}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {testimonial.position} at {testimonial.companyName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      testimonial.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : testimonial.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testimonial.status}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(testimonial._id)}
                    disabled={deleteMutation.isLoading}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="text-xs" />
                    {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>
              </div>
              <p className="text-[var(--text-primary)] mb-4">{testimonial.testimonialText}</p>
              {testimonial.status === "pending" && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: testimonial._id,
                        status: "approved",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                    Reject
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
