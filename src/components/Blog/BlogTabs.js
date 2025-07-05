import React, { memo } from "react";

const BlogTabs = memo(({ activeTab, setActiveTab, setSelectedCategory, setSearchQuery }) => {
  const handleTabClick = tab => {
    setActiveTab(tab);
    if (tab === "all") {
      setSelectedCategory("All");
      setSearchQuery("");
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <button
        onClick={() => handleTabClick("all")}
        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
          activeTab === "all"
            ? "bg-[var(--primary-main)] text-white"
            : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
        }`}
      >
        All Posts
      </button>
      <button
        onClick={() => handleTabClick("category")}
        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
          activeTab === "category"
            ? "bg-[var(--primary-main)] text-white"
            : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
        }`}
      >
        Categories
      </button>
      <button
        onClick={() => handleTabClick("search")}
        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
          activeTab === "search"
            ? "bg-[var(--primary-main)] text-white"
            : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
        }`}
      >
        Search
      </button>
    </div>
  );
});

BlogTabs.displayName = "BlogTabs";

export default BlogTabs;
