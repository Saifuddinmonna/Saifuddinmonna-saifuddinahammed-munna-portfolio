import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getBlogById(id),
  });

  const handleLike = async () => {
    try {
      await blogService.toggleLike(id);
      toast.success("Like updated successfully");
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.deleteBlog(id);
        toast.success("Post deleted successfully");
        navigate("/blog");
      } catch (error) {
        toast.error("Failed to delete post");
      }
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
        <div className="text-[var(--text-secondary)]">Post not found</div>
      </div>
    );
  }

  const isAuthor = currentUser?.uid === post.author?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{post.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-[var(--text-secondary)]">
                {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="text-[var(--primary-main)]">{post.category}</span>
              <span className="text-[var(--text-secondary)]">{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors duration-300"
              >
                {post.likes?.includes(currentUser?.uid) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span className="ml-1">{post.likes?.length || 0}</span>
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={() => navigate(`/blog/edit/${post._id}`)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Author Info */}
        {!post.author?.isHidden && (
          <div className="mt-12 p-6 bg-[var(--background-paper)] rounded-xl">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              About the Author
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium">{post.author?.name}</p>
                {post.author?.email && (
                  <p className="text-[var(--text-secondary)]">{post.author.email}</p>
                )}
                {post.author?.phone && (
                  <p className="text-[var(--text-secondary)]">{post.author.phone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Comments</h3>
          {/* Add comments section here */}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPost;
