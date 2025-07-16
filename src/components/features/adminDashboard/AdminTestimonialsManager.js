import React from "react";
import { motion } from "framer-motion";
import { FaComments, FaExclamationTriangle } from "react-icons/fa";
import TestimonialAdminDashboard from "../../Testimonials/TestimonialAdminDashboard";

const AdminTestimonialsManager = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FaComments className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Testimonial Manager</h1>
            <p className="text-[var(--text-secondary)]">
              Manage and moderate testimonials from your clients and visitors.
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Admin Controls</h3>
            <p className="text-blue-700 text-sm">
              You can approve, reject, or delete testimonials. Only approved testimonials will be
              displayed publicly on your portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial Admin Dashboard */}
      <TestimonialAdminDashboard
        onUpdate={() => {
          // This will be called when testimonials are updated
          console.log("Testimonials updated successfully");
        }}
      />
    </motion.div>
  );
};

export default AdminTestimonialsManager;
