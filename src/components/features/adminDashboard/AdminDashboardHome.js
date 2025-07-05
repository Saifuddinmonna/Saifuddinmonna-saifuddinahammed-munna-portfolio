import React from "react";
import { motion } from "framer-motion";
import { FaTachometerAlt, FaChartLine, FaUsers, FaCog, FaFileAlt } from "react-icons/fa";

const AdminDashboardHome = () => {
  const stats = [
    {
      title: "Total Posts",
      value: "12",
      icon: FaTachometerAlt,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Testimonials",
      value: "8",
      icon: FaUsers,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Projects",
      value: "15",
      icon: FaChartLine,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Gallery Items",
      value: "24",
      icon: FaCog,
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Resume Manager",
      icon: FaFileAlt,
      path: "/admin/dashboard/resumes",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your portfolio content, blog posts, testimonials, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
              <FaTachometerAlt className="text-2xl mb-2" />
              <span className="font-medium">Manage Blog</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300">
              <FaUsers className="text-2xl mb-2" />
              <span className="font-medium">Testimonials</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
              <FaChartLine className="text-2xl mb-2" />
              <span className="font-medium">My Work</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
              <FaCog className="text-2xl mb-2" />
              <span className="font-medium">Gallery</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardHome;
