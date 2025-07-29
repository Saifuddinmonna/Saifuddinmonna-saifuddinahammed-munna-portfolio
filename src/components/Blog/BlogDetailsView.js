import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaCalendar,
  FaUser,
  FaClock,
  FaEye,
  FaTags,
} from "react-icons/fa";

const BlogDetailsView = memo(({ blogs, handleLike, user }) => {
  console.log("🔄 BlogDetailsView re-rendered with", blogs.length, "blogs");

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--text-secondary)] text-lg mb-4">No blogs found.</div>
        <div className="text-[var(--text-secondary)] text-sm">
          Try adjusting your search or category filters.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blogs.map(blog => {
        // Check if user liked this post
        const hasLiked = user && (blog.likes || []).some(like => like.email === user.email);

        // Permission logic for edit button
        const isAdmin = user?.role === "admin";
        const isAuthor = user?.email && blog.author?.email && user.email === blog.author.email;
        const canEdit = isAdmin || isAuthor;

        // Get image URL
        const imageUrl = blog.image?.url || null;

        // Get categories
        const categoryBadges =
          Array.isArray(blog.categories) && blog.categories.length > 0
            ? blog.categories.map(cat =>
                typeof cat === "object" && cat.name
                  ? cat.name
                  : typeof cat === "string"
                  ? cat
                  : "General"
              )
            : ["General"];

        // Get tags
        const tags = Array.isArray(blog.tags) ? blog.tags : [];

        // Get content preview (200 words)
        const contentPreview = blog.content
          ? blog.content.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
          : "No content available";

        return (
          <div
            key={blog._id}
            className="bg-[var(--background-paper)] rounded-lg border border-[var(--border-main)] overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-main)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    {blog.title || "Untitled Post"}
                  </h2>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
                    <div className="flex items-center gap-1">
                      <FaUser className="w-4 h-4" />
                      <span>{blog.author?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendar className="w-4 h-4" />
                      <span>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    {blog.readTime && (
                      <div className="flex items-center gap-1">
                        <FaClock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {categoryBadges.map((cat, idx) => (
                      <span
                        key={cat + idx}
                        className="px-3 py-1 bg-[var(--primary-dark)] text-white rounded-full text-sm font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <FaTags className="w-4 h-4 text-[var(--text-secondary)]" />
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, idx) => (
                          <span
                            key={tag + idx}
                            className="px-2 py-1 bg-[var(--background-elevated)] text-[var(--text-secondary)] rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleLike && handleLike(blog._id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      hasLiked
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)]"
                    }`}
                    title={hasLiked ? "Unlike this post" : "Like this post"}
                  >
                    {hasLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{(blog.likes || []).length}</span>
                  </button>

                  {canEdit && (
                    <Link
                      to={`/blog/edit/${blog._id}`}
                      className="text-yellow-500 hover:text-yellow-600 p-2 rounded-lg transition-colors duration-200"
                      title="Edit this post"
                    >
                      <FaEdit size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              {imageUrl && (
                <div className="mb-6">
                  <img
                    src={imageUrl}
                    alt={blog.title || "Blog post image"}
                    className="w-full h-64 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  Content Preview
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{contentPreview}</p>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Author Details</h4>
                  <div className="text-sm text-[var(--text-secondary)]">
                    <p>
                      <strong>Name:</strong> {blog.author?.name || "Anonymous"}
                    </p>
                    <p>
                      <strong>Email:</strong> {blog.author?.email || "Not provided"}
                    </p>
                    {blog.author?.phone && (
                      <p>
                        <strong>Phone:</strong> {blog.author.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Post Details</h4>
                  <div className="text-sm text-[var(--text-secondary)]">
                    <p>
                      <strong>Status:</strong> {blog.status || "Published"}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : "Unknown"}
                    </p>
                    <p>
                      <strong>Likes:</strong> {(blog.likes || []).length}
                    </p>
                    <p>
                      <strong>Categories:</strong> {categoryBadges.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-main)]">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="flex items-center gap-2 bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <FaEye />
                    <span>Read Full Post</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

BlogDetailsView.displayName = "BlogDetailsView";

export default BlogDetailsView;
