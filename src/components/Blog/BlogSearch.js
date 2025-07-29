import React, { memo } from "react";
import { FaSearch } from "react-icons/fa";

const BlogSearch = memo(({ searchQuery, handleSearchQueryChange, handleSearch }) => {
  console.log("🔄 BlogSearch re-rendered with query:", searchQuery);

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const handleSearchClick = e => {
    e.preventDefault();
    handleSearch(e);
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSearch}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onKeyPress={handleKeyPress}
          placeholder="Search by title, content, or tags..."
          className="w-full px-4 py-3 pr-12 bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] transition-all duration-200"
        />
        <button
          type="submit"
          onClick={handleSearchClick}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors duration-200 cursor-pointer"
        >
          <FaSearch className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
});

BlogSearch.displayName = "BlogSearch";

export default BlogSearch;
