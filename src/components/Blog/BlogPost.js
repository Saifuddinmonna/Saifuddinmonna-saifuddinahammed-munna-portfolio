import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
  const contentRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

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

  // Add scroll buttons for tables
  useEffect(() => {
    if (!contentRef.current) return;
    // Find all tables in the rendered HTML
    const tables = contentRef.current.querySelectorAll("table");
    tables.forEach(table => {
      table.classList.add("blog-table-scrollable");
      // Wrap table in a div if not already wrapped
      if (!table.parentElement.classList.contains("blog-table-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "blog-table-wrapper";
        table.parentElement.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      const wrapper = table.parentElement;
      // Remove old arrows if any
      const oldLeft = wrapper.querySelector(".blog-table-arrow.left");
      const oldRight = wrapper.querySelector(".blog-table-arrow.right");
      if (oldLeft) oldLeft.remove();
      if (oldRight) oldRight.remove();
      // Add left arrow
      const leftArrow = document.createElement("button");
      leftArrow.className = "blog-table-arrow left";
      leftArrow.type = "button";
      leftArrow.innerHTML = `<svg width='18' height='18' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M15 19l-7-7 7-7'/></svg>`;
      leftArrow.onclick = () => {
        wrapper.scrollTo({ left: 0, behavior: "smooth" });
      };
      wrapper.appendChild(leftArrow);
      // Add right arrow
      const rightArrow = document.createElement("button");
      rightArrow.className = "blog-table-arrow right";
      rightArrow.type = "button";
      rightArrow.innerHTML = `<svg width='18' height='18' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M9 5l7 7-7 7'/></svg>`;
      rightArrow.onclick = () => {
        wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: "smooth" });
      };
      wrapper.appendChild(rightArrow);
    });
  }, [post?.content]);

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

  return (
    <div className="min-h-screen bg-[var(--background-default)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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

            <div
              ref={contentRef}
              className="prose prose-lg max-w-none text-[var(--text-primary)] mb-8 blog-content-with-scroll"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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
