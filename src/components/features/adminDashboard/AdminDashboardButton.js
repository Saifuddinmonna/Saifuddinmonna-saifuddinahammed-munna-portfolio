import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCog, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../../auth/context/AuthContext";

const AdminDashboardButton = () => {
  const { user, dbUser } = useAuth();

  // Check if user is admin
  const isAdmin = dbUser?.role === "admin" && dbUser?.isAdmin === true;
  console.log("form admin dashboard button", isAdmin);

  if (!isAdmin) {
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
