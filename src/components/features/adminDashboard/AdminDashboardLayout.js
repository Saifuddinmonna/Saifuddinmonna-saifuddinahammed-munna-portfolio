import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaBlog,
  FaComments,
  FaBriefcase,
  FaImages,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaFileAlt,
  FaSitemap,
} from "react-icons/fa";
import { useAuth } from "../../../auth/context/AuthContext";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false for mobile
  const { logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaTachometerAlt,
      path: "/admin/dashboard",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Blog Manager",
      icon: FaBlog,
      path: "/admin/dashboard/blog",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Testimonial Manager",
      icon: FaComments,
      path: "/admin/dashboard/testimonials",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "My Project Works",
      icon: FaBriefcase,
      path: "/admin/dashboard/myprojectworks",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "My Work Gallery",
      icon: FaImages,
      path: "/admin/dashboard/gallery",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Resume Manager",
      icon: FaFileAlt,
      path: "/admin/dashboard/resumes",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Category Manager",
      icon: FaSitemap,
      path: "/admin/dashboard/categories",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = path => {
    return location.pathname === path;
  };

  const handleMenuClick = path => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2.5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FaTachometerAlt className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text-primary)]">Admin Panel</h1>
              <p className="text-xs text-[var(--text-secondary)]">Dashboard</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-nav-menu">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleMenuClick(item.path)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300 group ${
                  isActive(item.path)
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)] hover:text-[var(--primary-main)]"
                }`}
              >
                <item.icon
                  className={`text-sm transition-transform duration-300 ${
                    isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium text-sm">{item.name}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </button>
            </motion.div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-[var(--border-color)]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaSignOutAlt className="text-sm" />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Top Bar */}
        <div className="admin-top-bar">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {menuItems.find(item => isActive(item.path))?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
