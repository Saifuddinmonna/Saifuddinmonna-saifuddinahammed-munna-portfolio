import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaUser,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "../../../../auth/context/AuthContext";
import { useCanEdit, useCanDelete } from "../../../../utils/adminUtils";

const AdminBlogCard = ({ post, onDelete, onLike, onEdit, onView, isAdmin }) => {
  const { user, dbUser } = useAuth();
  const hasLiked = post.likes?.some(like => like.email === user?.email);

  // Use the utility hooks to check if user can edit and delete this specific post
  const canEdit = useCanEdit(post);
  const canDelete = useCanDelete(post);

  // Debug logging for specific post
  if (post.title === "MongoDB চিটশিট (Cheat Sheet)") {
    console.log("🔍 Debug for MongoDB post:");
    console.log("  - Post title:", post.title);
    console.log("  - Post author:", post.author);
    console.log("  - Current user:", user?.email);
    console.log("  - dbUser:", dbUser);
    console.log("  - canEdit:", canEdit);
    console.log("  - canDelete:", canDelete);
    console.log("  - isAdmin prop:", isAdmin);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg border border-[var(--border-main)] hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={onView}
              className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
            >
              <FaEye className="text-sm" />
            </button>
            {canEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-blue-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
              >
                <FaEdit className="text-sm" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(post._id)}
                className="p-2 bg-red-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 flex-1">
            {post.title}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
          <div className="flex items-center gap-1">
            <FaUser className="text-xs" />
            <span>{post.author?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-xs" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Category & Read Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] text-xs rounded-full">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <FaClock />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Content Preview */}
        <div
          className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1 text-sm transition-colors ${
              hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
            }`}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{post.likes?.length || 0}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onView}
              className="px-3 py-1 text-xs bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              View
            </button>
            {canEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            )}
            {!post.image && canDelete && (
              <button
                onClick={() => onDelete(post._id)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBlogCard;
