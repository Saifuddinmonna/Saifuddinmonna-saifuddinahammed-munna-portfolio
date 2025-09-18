import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBookOpen,
  FaClock,
} from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import TinyMCEViewer from "../ui/TinyMCEViewer";
import BlogPagination from "../ui/BlogPagination";
import { useBlogPagination } from "../../hooks/useBlogPagination";
import "../ui/BlogPagination.css";

// Utility to normalize internal anchor links
function normalizeInternalAnchors(html) {
  return html.replace(
    /<a\s+([^>]*?)href=["'](?:https?:\/\/[^\/]+)?\/blog\/[^"'#]+(#_[^"']+)["']/gi,
    '<a $1href="$2"'
  );
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  // For copy-to-clipboard feedback per badge
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const isManualNavigationRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setShowScrollTop(scrollY > 200);
      setShowScrollBottom(scrollY + windowHeight < docHeight - 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await blogService.getBlog(id);
      console.log("BlogPost API Response:", response);
      return response;
    },
  });

  const post = response?.data || response;

  // Initialize pagination hook
  const {
    currentPage,
    totalPages,
    currentPageContent,
    currentPageWordCount,
    readingProgress,
    currentPageReadTime,
    isLoading: paginationLoading,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
  } = useBlogPagination(post?.content, 250, 200); // 250 words per page, minimum 200 - standard reading

  // Scroll to specific page position
  const scrollToPage = pageNumber => {
    const contentElement = document.querySelector(".blog-content-with-scroll");
    if (!contentElement || totalPages <= 1) return;

    const scrollHeight = contentElement.scrollHeight;
    const clientHeight = contentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    // Calculate scroll position for the page
    const scrollPercentage = (pageNumber - 1) / (totalPages - 1);
    const targetScrollTop = scrollPercentage * maxScroll;

    // Smooth scroll to the calculated position
    contentElement.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  };

  // Enhanced goToPage function that also scrolls
  const handlePageChange = pageNumber => {
    // Set manual navigation flag to prevent auto-scroll interference
    isManualNavigationRef.current = true;

    goToPage(pageNumber);
    scrollToPage(pageNumber);

    // Reset manual navigation flag after scroll completes
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 1000);
  };

  // Wrapper functions for pagination with manual navigation flag
  const handleNextPage = () => {
    isManualNavigationRef.current = true;
    goToNextPage();
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 1000);
  };

  const handlePreviousPage = () => {
    isManualNavigationRef.current = true;
    goToPreviousPage();
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 1000);
  };

  const handleFirstPage = () => {
    isManualNavigationRef.current = true;
    goToFirstPage();
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 1000);
  };

  const handleLastPage = () => {
    isManualNavigationRef.current = true;
    goToLastPage();
    setTimeout(() => {
      isManualNavigationRef.current = false;
    }, 1000);
  };

  // TinyMCEViewer will handle anchor scrolling automatically

  // Add scroll buttons for tables - will be handled by TinyMCEViewer
  useEffect(() => {
    // TinyMCEViewer will handle table scrolling internally
    // This effect is kept for potential future enhancements
  }, [post?.content]);

  // Scroll detection DISABLED to prevent page jumping issues
  // Manual pagination works fine, so we'll rely on that
  useEffect(() => {
    console.log("Auto-scroll detection disabled to prevent page jumping issues");
  }, [totalPages, currentPage, goToPage]);

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === "ArrowLeft" && hasPreviousPage) {
        isManualNavigationRef.current = true;
        goToPreviousPage();
        setTimeout(() => {
          isManualNavigationRef.current = false;
        }, 1000);
      } else if (e.key === "ArrowRight" && hasNextPage) {
        isManualNavigationRef.current = true;
        goToNextPage();
        setTimeout(() => {
          isManualNavigationRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [hasPreviousPage, hasNextPage, goToPreviousPage, goToNextPage]);

  // Get categories - show only name, fallback to ID, fallback to 'General'
  let categoryBadges = [{ name: "General" }];
  if (post) {
    if (Array.isArray(post.categories) && post.categories.length > 0) {
      categoryBadges = post.categories.map(cat => {
        if (typeof cat === "object") {
          return { name: cat.name || cat._id || "General" };
        }
        if (typeof cat === "string") return { name: cat };
        return { name: "General" };
      });
    } else if (post.category) {
      if (typeof post.category === "object") {
        categoryBadges = [{ name: post.category.name || post.category._id || "General" }];
      } else if (typeof post.category === "string") {
        categoryBadges = [{ name: post.category }];
      }
    }
  }

  const likeMutation = useMutation({
    mutationFn: () =>
      blogService.toggleLike(id, {
        email: user?.email,
        role: user?.role === "admin" ? "admin" : "user",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs", id]);
      const hasLiked = post.likes?.some(like => like.email === user?.email);
      toast.success(hasLiked ? "Post unliked successfully" : "Post liked successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to update like");
    },
  });

  const commentMutation = useMutation({
    mutationFn: commentData =>
      blogService.addComment(id, {
        ...commentData,
        author: {
          name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
          email: user?.email || "",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      setComment("");
      toast.success("Comment added successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to add comment");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      blogService.updateComment(
        id,
        commentId,
        { content },
        {
          email: user?.email,
          role: user?.role === "admin" ? "admin" : "user",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      setEditingComment(null);
      setEditCommentText("");
      toast.success("Comment updated successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to update comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentId =>
      blogService.deleteComment(id, commentId, {
        email: user?.email,
        role: user?.role === "admin" ? "admin" : "user",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      toast.success("Comment deleted successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to delete comment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => blogService.deleteBlog(id),
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      navigate("/blog");
    },
    onError: error => {
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    likeMutation.mutate();
  };

  const handleComment = e => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    commentMutation.mutate({ content: comment });
  };

  const handleEditComment = comment => {
    setEditingComment(comment._id);
    setEditCommentText(comment.text);
  };

  const handleUpdateComment = e => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to edit comments");
      return;
    }
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    updateCommentMutation.mutate({
      commentId: editingComment,
      content: editCommentText,
    });
  };

  const handleDeleteComment = commentId => {
    if (!user) {
      toast.error("Please login to delete comments");
      return;
    }
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading blog post: {error.message}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-primary)]">Blog post not found</div>
      </div>
    );
  }

  const isAuthor = user && post.author?.email === user.email;
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  const normalizedContent = post?.content ? normalizeInternalAnchors(post.content) : "";

  return (
    <div className="min-h-screen bg-[var(--background-default)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Page Indicator - Professional Style */}
      {totalPages > 1 && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 floating-page-indicator rounded-lg p-4 shadow-lg">
          <div className="text-center">
            <div className="text-xs text-[var(--text-secondary)] mb-1 font-medium">PAGE</div>
            <div className="text-xl font-bold text-[var(--primary-main)] mb-1">{currentPage}</div>
            <div className="text-xs text-[var(--text-secondary)] mb-3">of {totalPages}</div>
            <div className="w-20 bg-[var(--background-default)] rounded-full h-1.5 mx-auto">
              <div
                className="progress-bar h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-2">
              {readingProgress}% complete
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top/Bottom Floating Buttons */}
      {showScrollTop && (
        <button
          className="fixed bottom-8 right-8 z-50 blog-scroll-arrow"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowLeft style={{ transform: "rotate(-90deg)" }} size={24} />
        </button>
      )}
      {showScrollBottom && (
        <button
          className="fixed top-24 right-8 z-50 blog-scroll-arrow"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <FaArrowLeft style={{ transform: "rotate(90deg)" }} size={24} />
        </button>
      )}
      <div className="blog-main-window max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blog")}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </button>
        <article className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg">
          {post.image && (
            <img
              src={
                typeof post.image === "object" && post.image.url && post.image.url !== null
                  ? post.image.url
                  : typeof post.image === "string"
                  ? post.image
                  : ""
              }
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">{post.title}</h1>
              {isAuthor && (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/blog/edit/${post._id}`)}
                    className="text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <FaTrash size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center text-sm text-[var(--text-secondary)] mb-8">
              {/* Category badges - stacked name and ID */}
              {categoryBadges.map((cat, idx) => (
                <span
                  key={cat.name + idx}
                  className="px-3 py-1 bg-[var(--primary-dark)] text-white rounded-full text-xs font-bold shadow border-white/20 mr-2 category-badge flex flex-col items-center"
                  style={{ minWidth: 80 }}
                >
                  <span className="font-bold">{cat.name}</span>
                </span>
              ))}
              <span>By {post.author?.name || "Anonymous"}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-[var(--primary-main)]">{post.tags[0]}</span>
                </>
              )}
            </div>

            {/* Fixed Reading Progress Bar - Top */}
            {totalPages > 1 && showProgressBar && (
              <div className="fixed-progress-bar">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <FaBookOpen size={14} />
                      <span>Reading Progress</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <FaClock size={12} />~{currentPageReadTime} min
                      </span>
                      <span>{currentPageWordCount} words</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--primary-main)]">
                      {Math.round(readingProgress)}%
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">Complete</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      (Page {currentPage} of {totalPages})
                    </span>
                    <button
                      onClick={() => setShowProgressBar(false)}
                      className="ml-2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="Hide progress bar"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[var(--background-paper)] rounded-full h-3 border border-[var(--border-main)]">
                  <div
                    className="progress-bar h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(100, readingProgress))}%`,
                      backgroundColor: "var(--primary-main)",
                      background:
                        "linear-gradient(90deg, var(--primary-main), var(--primary-dark))",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Toggle Button for Progress Bar */}
            {totalPages > 1 && !showProgressBar && (
              <div className="fixed top-20 right-4 z-50">
                <button
                  onClick={() => setShowProgressBar(true)}
                  className="p-2 bg-[var(--primary-main)] text-white rounded-lg shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
                  title="Show progress bar"
                >
                  <FaBookOpen size={16} />
                </button>
              </div>
            )}

            {/* Blog Content - Full Scrollable with Auto-Pagination */}
            <div className="prose prose-lg max-w-none text-[var(--text-primary)] mb-8 blog-content-with-scroll min-h-[60vh] max-h-[70vh] overflow-y-auto content-with-fixed-elements">
              {paginationLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
                  <span className="ml-3 text-[var(--text-secondary)]">Loading content...</span>
                </div>
              ) : (
                <TinyMCEViewer
                  content={normalizeInternalAnchors(post?.content || "")}
                  className="blog-content-viewer"
                  debug={false}
                />
              )}
            </div>

            {/* Fixed Pagination Controls - Bottom */}
            {totalPages > 1 && showPagination && (
              <div className="fixed-pagination-container">
                <div className="pagination-content">
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onFirstPage={handleFirstPage}
                    onLastPage={handleLastPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    isLoading={paginationLoading}
                    currentPageWordCount={currentPageWordCount}
                    currentPageReadTime={currentPageReadTime}
                    readingProgress={readingProgress}
                    className="fixed-pagination"
                  />
                </div>
                <button
                  onClick={() => setShowPagination(false)}
                  className="pagination-close-btn"
                  title="Hide pagination"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            )}

            {/* Toggle Button for Pagination */}
            {totalPages > 1 && !showPagination && (
              <div className="fixed bottom-4 right-4 z-50">
                <button
                  onClick={() => setShowPagination(true)}
                  className="p-3 bg-[var(--primary-main)] text-white rounded-lg shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
                  title="Show pagination"
                >
                  <FaBookOpen size={18} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
                } transition-colors duration-300`}
                title={hasLiked ? "Unlike this post" : "Like this post"}
              >
                {hasLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes?.length || 0} likes</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Comments</h2>
              <form onSubmit={handleComment} className="mb-8">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  rows="4"
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
                >
                  Post Comment
                </button>
              </form>

              <div className="space-y-6">
                {post.comments?.map(comment => (
                  <div key={comment._id} className="bg-[var(--background-default)] rounded-lg p-4">
                    {editingComment === comment._id ? (
                      <form onSubmit={handleUpdateComment} className="space-y-4">
                        <textarea
                          value={editCommentText}
                          onChange={e => setEditCommentText(e.target.value)}
                          className="w-full px-4 py-2 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
                          >
                            <FaCheck />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComment(null);
                              setEditCommentText("");
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[var(--text-primary)]">
                                {comment.author?.name || "Anonymous"}
                              </span>
                              <span className="text-sm text-[var(--text-secondary)]">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] bg-[var(--background-paper)] p-2 rounded">
                              <p>{comment.text || "No content"}</p>
                            </div>
                          </div>
                          {user &&
                            (comment.author?.email === user.email || user.role === "admin") && (
                              <div className="flex gap-2 ml-2">
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                                  title="Edit comment"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete comment"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
