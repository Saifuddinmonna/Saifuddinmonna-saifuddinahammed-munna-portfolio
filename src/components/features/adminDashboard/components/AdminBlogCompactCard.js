import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../../../auth/context/AuthContext";
import { useCanEdit, useCanDelete } from "../../../../utils/adminUtils";

const AdminBlogCompactCard = ({ post, onDelete, onLike, onEdit, onView, isAdmin }) => {
  const { user } = useAuth();
  const hasLiked = post.likes?.some(like => like.email === user?.email);
  const canEdit = useCanEdit(post);
  const canDelete = useCanDelete(post);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-4 shadow-md border border-[var(--border-main)] hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Image */}
          {post.image && (
            <div className="w-16 h-12 flex-shrink-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-1">
              <span>{post.author?.name || "Anonymous"}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onLike(post._id)}
            className={`p-1 text-xs transition-colors ${
              hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
            }`}
          >
            {hasLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            onClick={onView}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
          >
            <FaEye className="text-xs" />
          </button>
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <FaEdit className="text-xs" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(post._id)}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <FaTrash className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBlogCompactCard;
