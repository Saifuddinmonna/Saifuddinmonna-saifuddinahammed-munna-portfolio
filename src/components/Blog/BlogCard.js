import React, { useState, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaEdit } from "react-icons/fa";

const BlogCard = memo(({ blog, handleLike, user }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get image URL - handle both object and string formats
  // Also handle cases where image object has null values
  const imageUrl = useMemo(() => {
    if (!blog.image) return null;
    if (typeof blog.image === "string") return blog.image;
    if (blog.image && typeof blog.image === "object" && blog.image.url && blog.image.url !== null) {
      return blog.image.url;
    }
    return null;
  }, [blog.image]);

  // Get categories - support array of objects
  const categoryBadges = useMemo(() => {
    if (Array.isArray(blog.categories) && blog.categories.length > 0) {
      return blog.categories.map(cat =>
        typeof cat === "object" && cat.name ? cat.name : typeof cat === "string" ? cat : "General"
      );
    }
    // fallback for old data
    if (blog.category) {
      if (typeof blog.category === "object" && blog.category.name) return [blog.category.name];
      if (typeof blog.category === "string") return [blog.category];
    }
    return ["General"];
  }, [blog.categories, blog.category]);

  // Memoize content processing for better performance
  const { plainText, truncatedText, hasMoreContent, displayText } = useMemo(() => {
    if (!blog.content) {
      return {
        plainText: "",
        truncatedText: "",
        hasMoreContent: false,
        displayText: "No content available",
      };
    }

    const plainText = blog.content.replace(/<[^>]*>/g, "");
    const words = plainText.split(" ");
    const truncatedText = words.slice(0, 80).join(" "); // Reduced to 80 words for better fit
    const hasMoreContent = words.length > 80;
    const displayText = showFullContent ? plainText : truncatedText;

    return { plainText, truncatedText, hasMoreContent, displayText };
  }, [blog.content, showFullContent]);

  // Check if user liked this post
  const hasLiked = useMemo(() => {
    if (!user) return false;
    return (blog.likes || []).some(like => like.email === user.email);
  }, [user, blog.likes]);

  // Permission logic for edit button
  const isAdmin = user?.role === "admin";
  const isAuthor = user?.email && blog.author?.email && user.email === blog.author.email;
  const canEdit = isAdmin || isAuthor;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = e => {
    // Fallback to a placeholder image if the original fails to load
    e.target.src = "/images/1.JPG";
    setImageLoaded(true);
    setImageError(true);
  };

  return (
    <div className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-color)] flex flex-col h-full">
      {/* Image Section */}
      {imageUrl && (
        <div className="h-48 flex-shrink-0 relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={blog.title || "Blog post image"}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}

      {/* Content Section - Fixed height to prevent footer movement */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Category and Read Time */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {categoryBadges.map((cat, idx) => (
            <span
              key={cat + idx}
              className="px-4 py-2 bg-[var(--primary-dark)] text-white rounded-full text-sm font-extrabold shadow-lg border-2 border-white/20 category-badge"
            >
              {cat}
            </span>
          ))}
          {blog.readTime && (
            <span className="text-[var(--text-secondary)] text-xs">{blog.readTime}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2 leading-tight">
          {blog.title || "Untitled Post"}
        </h2>

        {/* Content - Fixed height container */}
        <div className="flex-1 min-h-0 mb-4">
          <div className="h-full overflow-hidden">
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3">
              {displayText}
              {!showFullContent && hasMoreContent && (
                <span className="text-[var(--primary-main)]">...</span>
              )}
            </p>

            {/* Expanded content - Only show if there's more content */}
            {showFullContent && hasMoreContent && (
              <div className="mt-2 max-h-32 overflow-y-auto">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{plainText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section - Always at bottom */}
        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--primary-main)] font-bold text-sm">
                {blog.author?.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[var(--text-primary)] text-sm font-medium block truncate">
                {blog.author?.name || "Anonymous"}
              </span>
              {blog.createdAt && (
                <span className="text-[var(--text-secondary)] text-xs block">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex-1">
              {hasMoreContent && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-[var(--primary-light)]"
                >
                  {showFullContent ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
            {/* Like Button */}
            <button
              onClick={() => handleLike && handleLike(blog._id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                hasLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary-main)]"
              }`}
              title={hasLiked ? "Unlike this post" : "Like this post"}
            >
              {hasLiked ? <FaHeart /> : <FaRegHeart />}
              <span>{(blog.likes || []).length}</span>
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              {canEdit && (
                <Link
                  to={`/blog/edit/${blog._id}`}
                  className="text-yellow-500 hover:text-yellow-600 p-2 rounded-full transition-colors duration-200"
                  title="Edit this post"
                >
                  <FaEdit size={18} />
                </Link>
              )}
              <Link
                to={`/blog/${blog._id}`}
                className="bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] text-white transition-colors duration-300 text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-2"
              >
                Full Post
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BlogCard.displayName = "BlogCard";

export default BlogCard;
