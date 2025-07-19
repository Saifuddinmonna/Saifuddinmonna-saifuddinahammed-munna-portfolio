import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCog, FaShieldAlt } from "react-icons/fa";
import { useIsAdminSync } from "../../../utils/adminUtils";
import { useAuth } from "../../../auth/context/AuthContext";

const AdminDashboardButton = () => {
  // Use the synchronous hook for admin check
  const isAdmin = useIsAdminSync();
  const { loading, dbUser, user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  // Handle state changes
  useEffect(() => {
    // Wait for user data to load and check admin status
    const showButton = !loading && user && dbUser && isAdmin;
    setShouldShow(showButton);
  }, [loading, user, dbUser, isAdmin]);

  // Show loading spinner while waiting for user data
  if (loading) {
    return (
      <div className="ml-2 px-3 py-1.5 bg-gray-300 text-gray-600 text-sm font-medium flex items-center rounded-md">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Don't render if should not show
  if (!shouldShow) {
    return null;
  }

  return (
    <Link to="/admin/dashboard">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium flex items-center rounded-md overflow-hidden group transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.0)] hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] border-x border-white hover:border-[var(--primary-light)]"
      >
        <div className="relative mr-1.5">
          <FaCog className="text-sm group-hover:rotate-180 transition-transform duration-500" />
          <FaShieldAlt className="absolute -top-1 -right-1 text-xs text-yellow-300" />
        </div>
        <span className="font-medium">Admin Dashboard</span>
      </motion.button>
    </Link>
  );
};

export default AdminDashboardButton;
