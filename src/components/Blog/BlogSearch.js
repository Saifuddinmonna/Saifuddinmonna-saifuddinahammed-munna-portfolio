import React, { memo } from "react";
import { FaSearch } from "react-icons/fa";

const BlogSearch = memo(({ searchQuery, handleSearchQueryChange }) => (
  <form className="max-w-md mx-auto">
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        placeholder="Search blog posts..."
        className="w-full px-4 py-3 pr-12 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-all duration-200"
      />
      <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
    </div>
  </form>
));

BlogSearch.displayName = "BlogSearch";

export default BlogSearch;
