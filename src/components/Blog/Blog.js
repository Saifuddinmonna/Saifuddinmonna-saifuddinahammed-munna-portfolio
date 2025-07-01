import React, { useState, useMemo, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { toast } from "react-hot-toast";
import { FaSearch, FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { useDataFetching } from "../../hooks/useDataFetching";
import { useQueryClient } from "@tanstack/react-query";
import BlogGrid from "./BlogGrid";
import BlogLoading from "./BlogLoading";
import BlogError from "./BlogError";
import BlogPagination from "./BlogPagination";

const ARTICLES_PER_PAGE = 10;

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEmpty, setShowEmpty] = useState(false);

  // Use the new custom hook for better data handling
  const {
    data: blogs = {},
    isLoading,
    error,
    refetch,
  } = useDataFetching(
    ["blogs", currentPage, searchQuery, selectedCategory],
    () =>
      blogService.getAllBlogs({
        page: currentPage,
        limit: ARTICLES_PER_PAGE,
        search: searchQuery,
        category: selectedCategory === "All" ? "" : selectedCategory,
      }),
    {
      staleTime: 0, // Always fetch fresh data
      retry: 2,
      keepPreviousData: true,
    }
  );

  console.log("📊 [Blog] from Blog.js Raw data received:", blogs);
  console.log("📊 [Blog] from Blog.js Data type:", typeof blogs);
  console.log("📊 [Blog] from Blog.js Is array:", Array.isArray(blogs));

  // Defensive extraction: always get an array
  let postsArray = [];
  let totalPages = 1;
  if (Array.isArray(blogs)) {
    postsArray = blogs;
    totalPages = 1;
  } else if (Array.isArray(blogs?.data)) {
    postsArray = blogs.data;
    totalPages = blogs?.pagination?.pages || 1;
  }
  console.log("📊 [Blog] from Blog.js postsArray:", postsArray);
  console.log("📊 [Blog] from Blog.js totalPages:", totalPages);
  const handleReadMore = article => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = post => {
    navigate(`/blog/edit/${post.id}`);
  };

  const handleDelete = async postId => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.deleteBlog(postId);
        refetch();
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleLike = async postId => {
    try {
      await blogService.toggleLike(postId, {
        name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
        email: user?.email || "",
      });
      refetch();
      toast.success("Like updated successfully");
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setActiveTab("category");
  };

  const categories = ["All", "Web Development", "JavaScript", "React", "Node.js", "Database"];

  useEffect(() => {
    if (Array.isArray(postsArray) && postsArray.length === 0) {
      const timer = setTimeout(() => setShowEmpty(true), 3000); // 3 seconds
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [postsArray]);

  if (isLoading) {
    return <BlogLoading />;
  }

  if (error) {
    return <BlogError error={error} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] sm:text-5xl md:text-6xl">
            <span className="block">Web Development</span>
            <span className="block text-[var(--primary-main)]">Blog & Insights</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-[var(--text-secondary)] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Stay updated with the latest trends, tips, and insights in web development
          </p>
          {user && (
            <Link
              to="/blog/new"
              className="mt-6 px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
            >
              Write New Post
            </Link>
          )}
        </div>

        {/* Tabs and Search Section */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => {
                setActiveTab("all");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "all"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab("category")}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "category"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "search"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
            >
              Search
            </button>
          </div>

          {/* Search Form */}
          {activeTab === "search" && (
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search blog posts..."
                  className="w-full px-4 py-2 pl-10 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                />
                <FaSearch className="absolute left-3 top-3 text-[var(--text-secondary)]" />
              </div>
            </form>
          )}

          {/* Categories */}
          {activeTab === "category" && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    selectedCategory === category
                      ? "bg-[var(--primary-main)] text-white"
                      : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {Array.isArray(postsArray) && postsArray.length === 0 && showEmpty ? (
          <div className="text-center text-[var(--text-secondary)]">No post available</div>
        ) : (
          <BlogGrid blogs={postsArray} />
        )}

        {/* Pagination always visible */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          blogs={postsArray}
          totalPosts={blogs?.pagination?.total || postsArray.length}
        />

        {/* Newsletter Section */}
        <div className="mt-16 bg-[var(--primary-main)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Get the latest articles and insights delivered straight to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] bg-[var(--background-paper)] text-[var(--text-primary)]"
            />
            <button className="px-6 py-2 bg-[var(--background-paper)] text-[var(--primary-main)] rounded-lg font-semibold hover:bg-[var(--background-elevated)] transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-paper)] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-[var(--text-primary)] bg-[var(--background-paper)] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center text-sm text-[var(--text-secondary)] mb-6">
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.readTime}</span>
                <span className="mx-2">•</span>
                <span className="text-[var(--primary-main)]">{selectedArticle.tags[0]}</span>
              </div>
              <div
                className="prose prose-lg max-w-none text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
