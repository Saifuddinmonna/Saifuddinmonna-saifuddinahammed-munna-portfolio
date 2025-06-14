import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { testimonialService } from "../../services/testimonialService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const TestimonialAdminDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    data: testimonials,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: testimonialService.getAllTestimonials,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await testimonialService.updateTestimonialStatus(id, newStatus);
      toast.success("Testimonial status updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating testimonial status:", error);
      toast.error(error.message || "Failed to update testimonial status");
    }
  };

  const filteredTestimonials = testimonials?.filter(testimonial => {
    if (selectedStatus === "all") return true;
    return testimonial.status === selectedStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error.message || "Error loading testimonials. Please try again later."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Testimonials Admin Dashboard
        </h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--background-paper)] text-[var(--text-primary)]"
          >
            <option value="all">All Testimonials</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTestimonials?.map(testimonial => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={testimonial.clientImageURL || "/default-avatar.png"}
                    alt={testimonial.clientName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {testimonial.clientName}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{testimonial.email}</p>
                  {testimonial.position && (
                    <p className="text-sm text-[var(--text-secondary)]">{testimonial.position}</p>
                  )}
                  {testimonial.companyName && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {testimonial.companyName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStatusChange(testimonial._id, "approved")}
                  disabled={testimonial.status === "approved"}
                  className={`p-2 rounded-full transition-colors ${
                    testimonial.status === "approved"
                      ? "bg-green-100 text-green-500"
                      : "text-green-500 hover:bg-green-100"
                  }`}
                >
                  <FaCheck />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStatusChange(testimonial._id, "rejected")}
                  disabled={testimonial.status === "rejected"}
                  className={`p-2 rounded-full transition-colors ${
                    testimonial.status === "rejected"
                      ? "bg-red-100 text-red-500"
                      : "text-red-500 hover:bg-red-100"
                  }`}
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[var(--text-primary)]">{testimonial.testimonialText}</p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  testimonial.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : testimonial.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
              </span>
              {testimonial.projectLink && (
                <a
                  href={testimonial.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary-main)] hover:underline text-sm"
                >
                  View Project
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials?.length === 0 && (
        <div className="text-center text-[var(--text-secondary)] py-8">No testimonials found.</div>
      )}
    </div>
  );
};

export default TestimonialAdminDashboard;
