import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { blogService } from "../../../services/blogService";
import { useAuth } from "../../../auth/context/AuthContext";
import { useIsAdmin, useCanEdit } from "../../../utils/adminUtils";
import AdminBlogCard from "./components/AdminBlogCard";
import AdminBlogListCard from "./components/AdminBlogListCard";
import AdminBlogCompactCard from "./components/AdminBlogCompactCard";
import StatCard from "./components/StatCard";
import Pagination from "./components/Pagination";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTags,
  FaChartLine,
  FaNewspaper,
  FaList,
  FaCompactDisc,
} from "react-icons/fa";

const AdminBlogManager = () => {
  const { user, dbUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, compact
  const limit = 12;

  // Use the utility hooks for admin and edit permissions
  const isAdmin = useIsAdmin();

  // Fetch blogs
  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-blogs", currentPage, searchTerm, selectedCategory],
    queryFn: async () => {
      const response = await blogService.getAllBlogs({
        page: currentPage,
        limit,
        search: searchTerm,
        category: selectedCategory,
      });
      return response;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-blogs"]);
      toast.success("Blog post deleted successfully");
    },
    onError: error => {
      toast.error(error.response?.data?.message || "Failed to delete blog post");
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: postId =>
      blogService.toggleLike(postId, {
        name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
        email: user?.email || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-blogs"]);
      toast.success("Like updated successfully");
    },
    onError: error => {
      toast.error("Failed to update like");
    },
  });

  const handleDelete = async postId => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(postId);
    }
  };

  const handleLike = async postId => {
    likeMutation.mutate(postId);
  };

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const categories = ["All", "Web Development", "JavaScript", "React", "Node.js", "Database"];

  // Get data from response
  const postsArray = blogs?.data || [];
  const totalPages = blogs?.pagination?.pages || 1;

  // Calculate statistics
  const stats = {
    total: blogs?.pagination?.total || 0,
    published: postsArray.filter(post => post.status === "published").length,
    draft: postsArray.filter(post => post.status === "draft").length,
    featured: postsArray.filter(post => post.featured).length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error loading blog posts: {error.message}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
        >
          Retry
        </button>
      </div>
    );
  }

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
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <FaNewspaper className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Blog Manager</h1>
            <p className="text-[var(--text-secondary)]">
              Manage and moderate your blog posts and articles.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Posts"
          value={stats.total}
          icon={FaNewspaper}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={FaChartLine}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Drafts"
          value={stats.draft}
          icon={FaEdit}
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Featured"
          value={stats.featured}
          icon={FaHeart}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Controls */}
      <div className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
            </form>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FaNewspaper className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FaList className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "compact"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FaCompactDisc className="text-sm" />
            </button>
          </div>

          {/* Add New Post */}
          <Link
            to="/admin/dashboard/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            <FaPlus className="text-sm" />
            <span>Add New Post</span>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category === "All" ? "" : category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === (category === "All" ? "" : category)
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="mb-6">
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsArray.map(post => (
              <AdminBlogCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onLike={handleLike}
                onEdit={() => navigate(`/admin/dashboard/blog/edit/${post._id}`)}
                onView={() => navigate(`/blog/${post._id}`)}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            {postsArray.map(post => (
              <AdminBlogListCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onLike={handleLike}
                onEdit={() => navigate(`/admin/dashboard/blog/edit/${post._id}`)}
                onView={() => navigate(`/blog/${post._id}`)}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {viewMode === "compact" && (
          <div className="space-y-2">
            {postsArray.map(post => (
              <AdminBlogCompactCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onLike={handleLike}
                onEdit={() => navigate(`/admin/dashboard/blog/edit/${post._id}`)}
                onView={() => navigate(`/blog/${post._id}`)}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.div>
  );
};

export default AdminBlogManager;
