import React, { memo, useEffect, useState } from "react";
import { blogCategoryAPI } from "../../services/apiService";

const BlogCategories = memo(({ selectedCategory, handleCategoryChange, activeTab }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab !== "category") return;
    setLoading(true);
    setError(null);
    blogCategoryAPI
      .getAllCategories()
      .then(data => setCategories(data || []))
      .catch(err => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, [activeTab]);

  if (activeTab !== "category") {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-4 text-[var(--text-secondary)]">Loading categories...</div>
    );
  }
  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <button
        key="all"
        onClick={() => handleCategoryChange("All")}
        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
          selectedCategory === "All"
            ? "bg-[var(--primary-main)] text-white"
            : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category._id}
          onClick={() => handleCategoryChange(category.name)}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            selectedCategory === category.name
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
});

BlogCategories.displayName = "BlogCategories";

export default BlogCategories;
