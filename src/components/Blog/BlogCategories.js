import React, { memo } from "react";

const BlogCategories = memo(({ selectedCategory, handleCategoryChange, activeTab }) => {
  if (activeTab !== "category") {
    return null;
  }

  const categories = ["All", "Web Development", "JavaScript", "React", "Node.js", "Database"];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            selectedCategory === category
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
});

BlogCategories.displayName = "BlogCategories";

export default BlogCategories;
