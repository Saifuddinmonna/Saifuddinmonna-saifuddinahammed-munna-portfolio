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
} from "react-icons/fa";
import { useAuth } from "../../../auth/context/AuthContext";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
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
      name: "My Work Manager",
      icon: FaBriefcase,
      path: "/admin/dashboard/mywork",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "My Work Gallery",
      icon: FaImages,
      path: "/admin/dashboard/gallery",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = path => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-[var(--background-default)]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:relative z-50 h-full w-80 bg-[var(--background-paper)] border-r border-[var(--border-color)] shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FaTachometerAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
              <p className="text-sm text-[var(--text-secondary)]">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--background-elevated)] transition-colors"
          >
            <FaTimes className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive(item.path)
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)] hover:text-[var(--primary-main)]"
                }`}
              >
                <item.icon
                  className={`text-xl transition-transform duration-300 ${
                    isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </button>
            </motion.div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--background-paper)] border-b border-[var(--border-color)] p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--background-elevated)] transition-colors"
          >
            <FaBars className="text-[var(--text-primary)] text-xl" />
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {menuItems.find(item => isActive(item.path))?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
