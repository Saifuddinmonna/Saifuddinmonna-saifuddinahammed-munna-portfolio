import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { motion } from "framer-motion";
import {
  FaRegHeart,
  FaHeart,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaUser,
  FaCalendar,
  FaClock,
  FaEye,
  FaTag,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  console.log("BlogPost Component - Post ID:", id);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await blogService.getBlog(id);
      return response;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      blogService.toggleLike(id, {
        name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
        email: user?.email || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      toast.success("Like updated successfully");
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate();
    }
  };

  // Function to safely render HTML content
  const renderHTML = html => {
    return { __html: html };
  };

  // Function to format date
  const formatDate = dateString => {
    if (!dateString) return "";
    const date = new Date(dateString.$date || dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Update page title when post loads
  useEffect(() => {
    if (post?.title) {
      console.log("Updating page title to:", post.title);
      document.title = `${post.title} | Blog`;
    }
    return () => {
      document.title = "Blog";
    };
  }, [post?.title]);

  if (isLoading) {
    console.log("Loading blog post...");
    return (
      <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error state:", error);
    return (
      <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center">
        <div className="text-[var(--text-primary)]">
          {error.message || "Failed to load blog post"}
        </div>
      </div>
    );
  }

  if (!post) {
    console.log("No post data available");
    return (
      <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center">
        <div className="text-[var(--text-primary)]">Post not found</div>
      </div>
    );
  }

  console.log("Rendering blog post with data:", post);

  const isAuthor = user && post.author?.email === user.email;
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[var(--background-default)]"
    >
      {/* Post Header Section */}
      <div className="bg-[var(--background-paper)] border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] mb-8"
          >
            <FaArrowLeft />
            Back to Blog
          </button>

          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6">{post.title}</h1>

          {/* Author Information */}
          <div className="bg-[var(--background-default)] p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Author Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaUser className="text-[var(--primary-main)]" />
                <span className="text-[var(--text-primary)]">
                  Name: {post.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[var(--primary-main)]" />
                <span className="text-[var(--text-primary)]">
                  Email: {post.author?.email || "Not provided"}
                </span>
              </div>
              {post.author?.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-[var(--primary-main)]" />
                  <span className="text-[var(--text-primary)]">Phone: {post.author.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Post Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-secondary)] mb-8">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-[var(--primary-main)]" />
              <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[var(--primary-main)]" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-[var(--primary-main)]" />
              <span>{post.views || 0} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] rounded-full text-sm"
                >
                  <FaTag className="text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-xl mb-8"
            />
          )}
        </div>
      </div>

      {/* Post Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-[var(--background-paper)] rounded-xl p-8 shadow-lg">
          {/* Post Content with TinyMCE Formatting */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Like Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
            >
              {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{post.likes?.length || 0} Likes</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Comments ({post.comments?.length || 0})
            </h2>

            {user && (
              <form onSubmit={handleComment} className="mb-8">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-4 rounded-lg bg-[var(--background-default)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  rows="4"
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Post Comment
                </button>
              </form>
            )}

            <div className="space-y-6">
              {post.comments?.map(comment => (
                <div key={comment._id} className="bg-[var(--background-default)] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {comment.author?.name || "Anonymous"}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--text-primary)]">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPost;
