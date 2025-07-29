import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaEdit, FaCalendar, FaUser, FaClock } from "react-icons/fa";

const BlogListView = memo(({ blogs, handleLike, user }) => {
  console.log("🔄 BlogListView re-rendered with", blogs.length, "blogs");

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
    <div className="space-y-4">
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

        return (
          <div
            key={blog._id}
            className="bg-[var(--background-paper)] rounded-lg border border-[var(--border-main)] overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              {imageUrl && (
                <div className="md:w-48 md:h-32 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={blog.title || "Blog post image"}
                    className="w-full h-32 md:h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                      {blog.title || "Untitled Post"}
                    </h3>

                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {categoryBadges.map((cat, idx) => (
                        <span
                          key={cat + idx}
                          className="px-2 py-1 bg-[var(--primary-dark)] text-white rounded-full text-xs font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
                      <div className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        <span>{blog.author?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        <span>
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                      {blog.readTime && (
                        <div className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          <span>{blog.readTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Preview */}
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-3">
                      {blog.content
                        ? blog.content.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
                        : "No content available"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike && handleLike(blog._id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors duration-200 ${
                          hasLiked
                            ? "text-red-500 hover:text-red-600"
                            : "text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
                        }`}
                        title={hasLiked ? "Unlike this post" : "Like this post"}
                      >
                        {hasLiked ? <FaHeart /> : <FaRegHeart />}
                        <span>{(blog.likes || []).length}</span>
                      </button>

                      {/* Edit Button */}
                      {canEdit && (
                        <Link
                          to={`/blog/edit/${blog._id}`}
                          className="text-yellow-500 hover:text-yellow-600 p-1 rounded transition-colors duration-200"
                          title="Edit this post"
                        >
                          <FaEdit size={14} />
                        </Link>
                      )}
                    </div>

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog._id}`}
                      className="bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] text-white text-sm font-medium px-3 py-1 rounded transition-colors duration-200"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

BlogListView.displayName = "BlogListView";

export default BlogListView;
