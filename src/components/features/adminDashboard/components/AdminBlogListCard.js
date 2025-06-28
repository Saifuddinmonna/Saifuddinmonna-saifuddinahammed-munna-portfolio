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

const AdminBlogListCard = ({ post, onDelete, onLike, onEdit, onView, isAdmin }) => {
  const { user } = useAuth();
  const hasLiked = post.likes?.some(like => like.email === user?.email);
  const canEdit = useCanEdit(post);
  const canDelete = useCanDelete(post);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-main)] hover:shadow-xl transition-all duration-300"
    >
      <div className="flex gap-6">
        {/* Image */}
        {post.image && (
          <div className="relative w-32 h-24 flex-shrink-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onView}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
              >
                <FaEye />
              </button>
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <FaEdit />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(post._id)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-2">
            <div className="flex items-center gap-1">
              <FaUser className="text-xs" />
              <span>{post.author?.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-xs" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-xs" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div
            className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] text-xs rounded-full">
                {post.category}
              </span>
              <button
                onClick={() => onLike(post._id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  hasLiked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
                }`}
              >
                {hasLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes?.length || 0}</span>
              </button>
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBlogListCard;
