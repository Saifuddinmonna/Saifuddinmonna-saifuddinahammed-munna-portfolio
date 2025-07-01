import React, { useState, useMemo, memo } from "react";
import { Link } from "react-router-dom";

const BlogCard = memo(({ blog }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize content processing for better performance
  const { plainText, truncatedText, hasMoreContent, displayText } = useMemo(() => {
    const plainText = blog.content.replace(/<[^>]*>/g, "");
    const words = plainText.split(" ");
    const truncatedText = words.slice(0, 100).join(" ");
    const hasMoreContent = words.length > 100;
    const displayText = showFullContent ? plainText : truncatedText;

    return { plainText, truncatedText, hasMoreContent, displayText };
  }, [blog.content, showFullContent]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-[400px] flex flex-col">
      {blog.image && (
        <div className="h-48 flex-shrink-0 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={blog.image}
            alt={blog.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] rounded-full text-sm">
            {blog.tags?.[0] || "No Tag"}
          </span>
          <span className="text-[var(--text-secondary)] text-sm">{blog.readTime || ""}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
          {blog.title || "Untitled"}
        </h2>
        <div className="flex-1">
          <p className="text-[var(--text-secondary)] mb-4 line-clamp-4">
            {displayText}
            {!showFullContent && hasMoreContent && (
              <span className="text-[var(--primary-main)]">...</span>
            )}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
              <span className="text-[var(--primary-main)] font-bold">
                {blog.author?.name?.[0] || "?"}
              </span>
            </div>
            <span className="text-[var(--text-primary)]">{blog.author?.name || "Unknown"}</span>
          </div>
          <div className="flex gap-2">
            {hasMoreContent && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-300 text-sm"
              >
                {showFullContent ? "Show Less" : "Read More"}
              </button>
            )}
            <Link
              to={`/blog/${blog._id}`}
              className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-300"
            >
              Full Post →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

BlogCard.displayName = "BlogCard";

export default BlogCard;
