import React from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaExclamationTriangle } from "react-icons/fa";
import ResumeAdminDashboard from "./components/ResumeAdminDashboard";

const AdminResumesManager = () => {
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
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <FaFileAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Resume Manager</h1>
            <p className="text-[var(--text-secondary)]">
              Manage, upload, and organize all resume versions for your portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-500 text-lg mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Admin Controls</h3>
            <p className="text-yellow-700 text-sm">
              You can create, edit, activate/deactivate, or delete resumes. Only active resumes will
              be available for public viewing or download.
            </p>
          </div>
        </div>
      </div>

      {/* Resume Admin Dashboard */}
      <ResumeAdminDashboard />
    </motion.div>
  );
};

export default AdminResumesManager;
