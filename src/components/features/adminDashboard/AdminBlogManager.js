import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { blogService } from "../../../services/blogService";
import { useAuth } from "../../../auth/context/AuthContext";
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
} from "react-icons/fa";

const AdminBlogManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, compact
  const limit = 12;

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
              <FaSearch className="absolute left-3 top-3 text-[var(--text-secondary)]" />
            </form>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--background-default)] text-[var(--text-primary)] appearance-none"
              >
                <option value="">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute left-3 top-3 text-[var(--text-secondary)]" />
            </div>
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "compact"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
            </button>
          </div>

          {/* Add New Post Button */}
          <Link
            to="/admin/dashboard/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus className="text-sm" />
            <span className="font-medium">New Post</span>
          </Link>
        </div>
      </div>

      {/* Blog Posts Grid/List */}
      <div className="space-y-6">
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
              />
            ))}
          </div>
        )}

        {postsArray.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--text-secondary)] mb-4">No blog posts found</div>
            <Link
              to="/admin/dashboard/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
            >
              <FaPlus />
              Create Your First Post
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </motion.div>
  );
};

// Admin Blog Card Component (Grid View)
const AdminBlogCard = ({ post, onDelete, onLike, onEdit, onView }) => {
  const { user } = useAuth();
  const isAuthor = user && post.author?.email === user.email;
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg border border-[var(--border-main)] hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={onView}
              className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
            >
              <FaEye className="text-sm" />
            </button>
            {isAuthor && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 bg-blue-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
                >
                  <FaEdit className="text-sm" />
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="p-2 bg-red-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
                >
                  <FaTrash className="text-sm" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 flex-1">
            {post.title}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
          <div className="flex items-center gap-1">
            <FaUser className="text-xs" />
            <span>{post.author?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-xs" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Category & Read Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] text-xs rounded-full">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <FaClock />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Content Preview */}
        <div
          className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1 text-sm transition-colors ${
              hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
            }`}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{post.likes?.length || 0}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onView}
              className="px-3 py-1 text-xs bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              View
            </button>
            {isAuthor && (
              <button
                onClick={onEdit}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Admin Blog List Card Component
const AdminBlogListCard = ({ post, onDelete, onLike, onEdit, onView }) => {
  const { user } = useAuth();
  const isAuthor = user && post.author?.email === user.email;
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-main)] hover:shadow-xl transition-all duration-300"
    >
      <div className="flex gap-6">
        {/* Image */}
        {post.image && (
          <div className="relative w-32 h-24 flex-shrink-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onView}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
              >
                <FaEye />
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={onEdit}
                    className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-2">
            <div className="flex items-center gap-1">
              <FaUser className="text-xs" />
              <span>{post.author?.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-xs" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-xs" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div
            className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] text-xs rounded-full">
                {post.category}
              </span>
              <button
                onClick={() => onLike(post._id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
                }`}
              >
                {hasLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes?.length || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Admin Blog Compact Card Component
const AdminBlogCompactCard = ({ post, onDelete, onLike, onEdit, onView }) => {
  const { user } = useAuth();
  const isAuthor = user && post.author?.email === user.email;
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-4 shadow-sm border border-[var(--border-main)] hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate flex-1">
            {post.title}
          </h3>
          <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] text-xs rounded-full flex-shrink-0">
            {post.category}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
            <FaUser className="text-xs" />
            <span className="hidden sm:inline">{post.author?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
            <FaCalendarAlt className="text-xs" />
            <span className="hidden sm:inline">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1 text-sm transition-colors ${
              hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
            }`}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
            <span className="hidden sm:inline">{post.likes?.length || 0}</span>
          </button>
          <button
            onClick={onView}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
          >
            <FaEye className="text-sm" />
          </button>
          {isAuthor && (
            <>
              <button
                onClick={onEdit}
                className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => onDelete(post._id)}
                className="p-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrash className="text-sm" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-main)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            currentPage === page
              ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
              : "border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default AdminBlogManager;
