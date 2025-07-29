import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaEdit, FaEye, FaTrash } from "react-icons/fa";

const BlogTableView = memo(({ blogs, handleLike, user }) => {
  console.log("🔄 BlogTableView re-rendered with", blogs.length, "blogs");

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
    <div className="bg-[var(--background-paper)] rounded-lg border border-[var(--border-main)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--background-elevated)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                Author
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                Categories
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                Likes
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-[var(--text-primary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-main)]">
            {blogs.map(blog => {
              // Check if user liked this post
              const hasLiked = user && (blog.likes || []).some(like => like.email === user.email);

              // Permission logic for edit button
              const isAdmin = user?.role === "admin";
              const isAuthor =
                user?.email && blog.author?.email && user.email === blog.author.email;
              const canEdit = isAdmin || isAuthor;

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
                <tr
                  key={blog._id}
                  className="hover:bg-[var(--background-elevated)] transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <h3 className="font-medium text-[var(--text-primary)] line-clamp-2">
                        {blog.title || "Untitled Post"}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-1">
                        {blog.content
                          ? blog.content.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
                          : "No content"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {blog.author?.name || "Anonymous"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {categoryBadges.slice(0, 2).map((cat, idx) => (
                        <span
                          key={cat + idx}
                          className="px-2 py-1 bg-[var(--primary-dark)] text-white rounded-full text-xs font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                      {categoryBadges.length > 2 && (
                        <span className="px-2 py-1 bg-[var(--background-elevated)] text-[var(--text-secondary)] rounded-full text-xs">
                          +{categoryBadges.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] p-1 rounded transition-colors duration-200"
                        title="View details"
                      >
                        <FaEye size={14} />
                      </Link>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

BlogTableView.displayName = "BlogTableView";

export default BlogTableView;
