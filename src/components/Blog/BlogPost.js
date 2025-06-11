import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getBlog(id),
  });

  const likeMutation = useMutation({
    mutationFn: () => blogService.likeBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => blogService.deleteBlog(id),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      navigate("/blog");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const commentMutation = useMutation({
    mutationFn: commentData => blogService.addComment(id, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      setComment("");
      toast.success("Comment added successfully!");
    },
  });

  const handleLike = () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }
    likeMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate();
    }
  };

  const handleComment = e => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    commentMutation.mutate({ content: comment });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading blog post. Please try again later.</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center">
        <div className="text-[var(--text-primary)]">Post not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] mb-8"
        >
          <FaArrowLeft />
          Back to Blog
        </button>

        <article className="bg-[var(--background-paper)] rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
            <span>By {post.author?.name || "Anonymous"}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
            >
              {post.likes?.includes(user?.uid) ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
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
