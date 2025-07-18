import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaChartLine,
  FaUsers,
  FaCog,
  FaFileAlt,
  FaSitemap,
  FaSpinner,
  FaDatabase,
  FaChartBar,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getAllCounts,
  getSimpleCounts,
  getDetailedStats,
  getRealTimeStats,
  getBlogs,
  getTestimonials,
  getCategories,
  getResumes,
} from "../../../services/apiService";

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    testimonials: 0,
    categories: 0,
    resumes: 0,
    totalCollections: 0,
    databaseStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataSource, setDataSource] = useState("stats-api"); // Track which API was used

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("🔄 [Dashboard] Starting data fetch...");
        setLoading(true);
        setError(null);

        // Try to get comprehensive stats first
        let databaseStats = {};
        let totalCollections = 0;

        try {
          console.log("📊 [Dashboard] Attempting to use Stats API...");
          // Get all collection counts from the new stats API
          const countsResponse = await getAllCounts();
          console.log("✅ [Dashboard] Stats API Response:", countsResponse);

          if (countsResponse.success && countsResponse.data) {
            // Fix: Map collection names to frontend fields (new structure)
            const collections = countsResponse.data; // .data directly contains the counts
            const newStats = {
              totalPosts: collections.blogs || 0,
              testimonials: collections.testimonials || 0,
              categories: collections.blogCategories || collections.categories || 0,
              resumes: collections.resumes || 0,
              totalCollections: Object.keys(collections).length,
              databaseStats: collections,
            };

            console.log("🎯 [Dashboard] Setting stats with Stats API data:", newStats);
            setStats(prevStats => ({
              ...prevStats,
              ...newStats,
            }));
            setDataSource("stats-api");
            console.log("✅ [Dashboard] Successfully used Stats API");
          } else {
            console.warn("⚠️ [Dashboard] Stats API response invalid:", countsResponse);
          }
        } catch (statsError) {
          console.warn(
            "❌ [Dashboard] Stats API failed, falling back to individual APIs:",
            statsError.message
          );
          console.warn("❌ [Dashboard] Stats API error details:", statsError);

          // Fallback to individual API calls
          console.log("🔄 [Dashboard] Starting individual API calls...");
          const results = await Promise.allSettled([
            getBlogs().catch(err => {
              console.warn("❌ [Dashboard] Blogs API error:", err.message);
              return { data: [] };
            }),
            getTestimonials().catch(err => {
              console.warn("❌ [Dashboard] Testimonials API error:", err.message);
              return { data: [] };
            }),
            getCategories().catch(err => {
              console.warn("❌ [Dashboard] Categories API error:", err.message);
              return { data: [] };
            }),
            getResumes().catch(err => {
              console.warn("❌ [Dashboard] Resumes API error:", err.message);
              return { data: [] };
            }),
          ]);

          console.log("📊 [Dashboard] Individual API Results:", results);

          // Extract data from results, handling both fulfilled and rejected promises
          const [blogsResult, testimonialsResult, categoriesResult, resumesResult] = results;

          const blogsData = blogsResult.status === "fulfilled" ? blogsResult.value?.data || [] : [];
          const testimonialsData =
            testimonialsResult.status === "fulfilled" ? testimonialsResult.value?.data || [] : [];
          const categoriesData =
            categoriesResult.status === "fulfilled" ? categoriesResult.value?.data || [] : [];
          const resumesData =
            resumesResult.status === "fulfilled" ? resumesResult.value?.data || [] : [];

          console.log("📈 [Dashboard] Extracted data from individual APIs:");
          console.log("  - Blogs:", blogsData.length);
          console.log("  - Testimonials:", testimonialsData.length);
          console.log("  - Categories:", categoriesData.length);
          console.log("  - Resumes:", resumesData.length);

          // Update stats with real data
          const fallbackStats = {
            totalPosts: blogsData.length,
            testimonials: testimonialsData.length,
            categories: categoriesData.length,
            resumes: resumesData.length,
            totalCollections: 4, // We know we have 4 main collections
            databaseStats: {
              blogs: blogsData.length,
              testimonials: testimonialsData.length,
              categories: categoriesData.length,
              resumes: resumesData.length,
            },
          };

          console.log("🎯 [Dashboard] Setting stats with fallback data:", fallbackStats);
          setStats(fallbackStats);
          setDataSource("individual-apis");
          console.log("✅ [Dashboard] Successfully used individual APIs");
        }

        setLastUpdated(new Date());
        console.log("✅ [Dashboard] Data fetch completed successfully");
      } catch (err) {
        console.error("❌ [Dashboard] Error fetching dashboard data:", err);
        console.error("❌ [Dashboard] Error details:", err.message);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        console.log("🏁 [Dashboard] Loading state set to false");
      }
    };

    console.log("🚀 [Dashboard] Component mounted, starting data fetch...");
    fetchDashboardData();
  }, []);

  // Debug logging for stats changes
  useEffect(() => {
    console.log("📊 [Dashboard] Stats updated:", stats);
  }, [stats]);

  // Debug logging for data source changes
  useEffect(() => {
    console.log("🔗 [Dashboard] Data source changed to:", dataSource);
  }, [dataSource]);

  // Debug logging for loading state changes
  useEffect(() => {
    console.log("⏳ [Dashboard] Loading state:", loading);
  }, [loading]);

  // Debug logging for error state changes
  useEffect(() => {
    if (error) {
      console.error("❌ [Dashboard] Error state:", error);
    }
  }, [error]);

  const dashboardStats = [
    {
      title: "Total Posts",
      value: stats.totalPosts.toString(),
      icon: FaTachometerAlt,
      color: "from-blue-500 to-blue-600",
      path: "/admin/dashboard/blog",
      description: "Blog posts in your portfolio",
      trend: "up",
    },
    {
      title: "Testimonials",
      value: stats.testimonials.toString(),
      icon: FaUsers,
      color: "from-green-500 to-green-600",
      path: "/admin/dashboard/testimonials",
      description: "Client testimonials",
      trend: "up",
    },
    {
      title: "Categories",
      value: stats.categories.toString(),
      icon: FaChartLine,
      color: "from-purple-500 to-purple-600",
      path: "/admin/dashboard/categories",
      description: "Blog categories",
      trend: "stable",
    },
    {
      title: "Resume Manager",
      value: stats.resumes.toString(),
      icon: FaFileAlt,
      path: "/admin/dashboard/resumes",
      color: "from-yellow-500 to-yellow-600",
      description: "Resume files",
      trend: "up",
    },
    {
      title: "Total Collections",
      value: stats.totalCollections.toString(),
      icon: FaDatabase,
      color: "from-indigo-500 to-indigo-600",
      path: null,
      description: "Database collections",
      trend: "stable",
    },
  ];

  // Calculate total documents
  const totalDocuments = Object.values(stats.databaseStats).reduce((sum, count) => sum + count, 0);

  // Get top collections by count
  const topCollections = Object.entries(stats.databaseStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Additional stats section for database overview
  const renderDatabaseOverview = () => {
    if (!stats.databaseStats || Object.keys(stats.databaseStats).length === 0) {
      return null;
    }

    return (
      <div className="admin-form-container bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center">
            <FaChartBar className="mr-2" />
            Database Overview
          </h2>
          <div className="flex items-center space-x-2">
            <FaInfoCircle className="text-[var(--text-secondary)] text-sm" />
            <span className="text-sm text-[var(--text-secondary)]">
              {dataSource === "stats-api" ? "Real-time data" : "Fallback data"}
            </span>
          </div>
        </div>

        <div className="admin-form-grid">
          {/* Total Documents Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Documents</p>
                <p className="text-2xl font-bold">{totalDocuments}</p>
              </div>
              <FaDatabase className="text-3xl opacity-80" />
            </div>
          </div>

          {/* Top Collections */}
          <div className="bg-[var(--background-default)] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
              Top Collections
            </h3>
            <div className="space-y-2">
              {topCollections.map(([collection, count], index) => (
                <div key={collection} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-primary)] capitalize">
                    {collection}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Source Info */}
          <div className="bg-[var(--background-default)] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Data Source</h3>
            <div className="flex items-center space-x-2">
              {dataSource === "stats-api" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500" />
              )}
              <span className="text-sm text-[var(--text-primary)]">
                {dataSource === "stats-api" ? "Stats API" : "Individual APIs"}
              </span>
            </div>
          </div>
        </div>

        {/* All Collections Grid */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">All Collections</h3>
          <div className="admin-blog-grid">
            {Object.entries(stats.databaseStats).map(([collection, count]) => (
              <div
                key={collection}
                className="text-center p-3 bg-[var(--background-default)] rounded-lg hover:bg-[var(--background-paper)] transition-colors"
              >
                <p className="text-sm font-medium text-[var(--text-secondary)] capitalize mb-1">
                  {collection}
                </p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{count}</p>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{
                        width: `${
                          (count / Math.max(...Object.values(stats.databaseStats))) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <FaSpinner className="text-4xl text-[var(--primary-main)] animate-spin mb-4" />
              <p className="text-[var(--text-secondary)]">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-[var(--text-secondary)]">
                Manage your portfolio content, blog posts, testimonials, and more.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
              <FaClock className="text-xs" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.path || "#"}
                className={`admin-stat-card block ${
                  stat.path ? "cursor-pointer hover:scale-105" : "cursor-default"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                      {stat.title}
                    </h3>
                    <p className="stat-value text-3xl font-bold text-[var(--text-primary)]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.description}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="text-white text-xl" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Database Overview */}
        {renderDatabaseOverview()}

        {/* Quick Actions Section */}
        <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)] mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/dashboard/blog"
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex flex-col items-center justify-center hover:scale-105"
            >
              <FaTachometerAlt className="text-2xl mb-2" />
              <span className="font-medium">Manage Blog</span>
            </Link>
            <Link
              to="/admin/dashboard/testimonials"
              className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex flex-col items-center justify-center hover:scale-105"
            >
              <FaUsers className="text-2xl mb-2" />
              <span className="font-medium">Testimonials</span>
            </Link>
            <Link
              to="/admin/dashboard/categories"
              className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex flex-col items-center justify-center hover:scale-105"
            >
              <FaChartLine className="text-2xl mb-2" />
              <span className="font-medium">Categories</span>
            </Link>
            <Link
              to="/admin/dashboard/gallery"
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex flex-col items-center justify-center hover:scale-105"
            >
              <FaCog className="text-2xl mb-2" />
              <span className="font-medium">Gallery</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-[var(--background-default)] rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">API Status</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {dataSource === "stats-api" ? "Stats API Active" : "Fallback Mode"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[var(--background-default)] rounded-lg">
              <FaDatabase className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Collections</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {stats.totalCollections} Active
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[var(--background-default)] rounded-lg">
              <FaEye className="text-purple-500" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Total Documents</p>
                <p className="text-xs text-[var(--text-secondary)]">{totalDocuments} Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-color)] mt-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">🔧 Debug Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Raw Database Stats
                </h3>
                <pre className="text-xs bg-[var(--background-default)] p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(stats.databaseStats, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Mapped Stats
                </h3>
                <pre className="text-xs bg-[var(--background-default)] p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(
                    {
                      totalPosts: stats.totalPosts,
                      testimonials: stats.testimonials,
                      categories: stats.categories,
                      resumes: stats.resumes,
                      totalCollections: stats.totalCollections,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboardHome;
