import React, { memo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import BlogOptimizationTest from "./BlogOptimizationTest";

const BlogSearchOptimized = memo(({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const handleInputChange = useCallback(
    e => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (onSearchSubmit) {
        onSearchSubmit();
      }
    },
    [onSearchSubmit]
  );

  return (
    <>
      <BlogOptimizationTest componentName="BlogSearchOptimized" props={{ searchQuery }} />
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search blog posts..."
            className="w-full px-4 py-3 pr-12 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-all duration-200"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
        </div>
      </form>
    </>
  );
});

BlogSearchOptimized.displayName = "BlogSearchOptimized";

export default BlogSearchOptimized;
