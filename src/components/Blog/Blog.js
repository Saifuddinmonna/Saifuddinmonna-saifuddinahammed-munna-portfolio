import { useState, useMemo, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { blogService } from "./blogService";
import { toast } from "react-hot-toast";

const ARTICLES_PER_PAGE = 10;

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        await blogService.deletePost(postId);
        toast.success("Post deleted successfully");
        fetchPosts(); // Refresh the posts list
      } catch (error) {
        toast.error("Failed to delete post");
        console.error("Error deleting post:", error);
      }
    }
  };

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

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Loading posts...</p>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {currentArticles.map(post => (
                <motion.article
                  key={post.id}
                  className="bg-[var(--background-paper)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--background-paper)] text-[var(--primary-main)]">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-[var(--text-secondary)] mb-2">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                      {post.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleReadMore(post)}
                        className="inline-flex items-center text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                      >
                        Read More
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2 sm:space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-[var(--background-paper)] border border-[var(--border-main)] text-[var(--text-primary)] rounded-md hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Previous
                </button>

                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={index}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 border border-[var(--border-main)] rounded-md text-sm sm:text-base ${
                        currentPage === page
                          ? "bg-[var(--primary-main)] text-[var(--text-primary)] border-[var(--primary-main)]"
                          : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span
                      key={index}
                      className="px-1 sm:px-2 py-2 text-[var(--text-secondary)] text-sm sm:text-base"
                    >
                      {page}
                    </span>
                  )
                )}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-[var(--background-paper)] border border-[var(--border-main)] text-[var(--text-primary)] rounded-md hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
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
