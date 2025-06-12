import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../auth/context/AuthContext";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await blogService.getBlog(id);
      return response;
    },
  });

  const post = response?.data;

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
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <article className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg">
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-96 object-cover" />
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">{post.title}</h1>
              {isAuthor && (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/blog/editor/${post._id}`)}
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
              className="prose prose-lg max-w-none text-[var(--text-primary)] mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
              >
                {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
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
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
