import React, { useState, useMemo, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { blogService } from "./blogService";
import { toast } from "react-hot-toast";
import { useBlogs } from "../../hooks/useBlogs";
import { FaSearch, FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";

const ARTICLES_PER_PAGE = 10;

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { currentUser } = useAuth();

  // Fetch blogs with search and category filters
  const {
    blogs,
    isLoading: useBlogsLoading,
    error,
    deleteBlog,
    toggleLike,
  } = useBlogs(currentPage, ARTICLES_PER_PAGE, searchQuery, selectedCategory);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to fetch blog posts");
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize calculations for current articles and total pages
  const { currentArticles, totalPages } = useMemo(() => {
    const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
    const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
    const articles = posts.slice(indexOfFirstArticle, indexOfLastArticle);
    const pages = Math.ceil(posts.length / ARTICLES_PER_PAGE);
    return { currentArticles: articles, totalPages: pages };
  }, [currentPage, posts]);

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
        await deleteBlog.mutateAsync(postId);
        toast.success("Post deleted successfully");
        fetchPosts(); // Refresh the posts list
      } catch (error) {
        toast.error("Failed to delete post");
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleLike = async id => {
    try {
      await toggleLike.mutateAsync(id);
    } catch (error) {
      console.error("Like error:", error);
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

  // Function to generate page numbers for pagination control
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max page numbers to show directly (e.g., 1 2 3 ... 7 8)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      if (currentPage > halfPagesToShow + 1) {
        pageNumbers.push("..."); // Ellipsis if current page is far from start
      }

      let startPage = Math.max(
        2,
        currentPage -
          halfPagesToShow +
          (currentPage > totalPages - halfPagesToShow ? totalPages - maxPagesToShow + 1 : 1)
      );
      let endPage = Math.min(
        totalPages - 1,
        currentPage +
          halfPagesToShow -
          (currentPage < halfPagesToShow + 1 ? maxPagesToShow - totalPages : 1)
      );

      // Adjust start and end if near beginning or end
      if (currentPage <= halfPagesToShow) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      }
      if (currentPage > totalPages - halfPagesToShow) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - halfPagesToShow) {
        pageNumbers.push("..."); // Ellipsis if current page is far from end
      }
      // Always show last page
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  if (useBlogsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading blog posts: {error.message}</div>
      </div>
    );
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
          <button
            onClick={() => navigate("/blog/new")}
            className="mt-6 px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
          >
            Write New Post
          </button>
        </div>

        {/* Tabs and Search Section */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => {
                setActiveTab("all");
                setSelectedCategory("");
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
                  onClick={() => handleCategoryChange(category === "All" ? "" : category)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    selectedCategory === (category === "All" ? "" : category)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.data?.map(post => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-[var(--primary-main)]">{post.category}</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{post.title}</h2>
                <p className="text-[var(--text-secondary)] mb-4">
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors duration-300"
                    >
                      {post.likes?.includes(currentUser?.uid) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span className="ml-1">{post.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => navigate(`/blog/edit/${post._id}`)}
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors duration-300"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {blogs?.totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-[var(--background-paper)] border border-[var(--border-main)] text-[var(--text-primary)] rounded-md hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-[var(--text-primary)]">
              Page {currentPage} of {blogs.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, blogs.totalPages))}
              disabled={currentPage === blogs.totalPages}
              className="px-3 py-2 bg-[var(--background-paper)] border border-[var(--border-main)] text-[var(--text-primary)] rounded-md hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results Message */}
        {blogs?.data?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] text-lg">
              {activeTab === "search"
                ? "No posts found matching your search."
                : activeTab === "category"
                ? "No posts found in this category."
                : "No blog posts available."}
            </p>
          </div>
        )}

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
                <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.readTime}</span>
                <span className="mx-2">•</span>
                <span className="text-[var(--primary-main)]">{selectedArticle.category}</span>
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
