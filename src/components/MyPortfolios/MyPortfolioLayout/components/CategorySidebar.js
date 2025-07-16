import React from "react";

const CategorySidebar = ({ allCategories, selectedCategory, setSelectedCategory }) => (
  <div className="w-full md:w-64 lg:w-72 shrink-0">
    <div className="sticky top-24 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md border border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
            selectedCategory === null
              ? "bg-[var(--primary-main)] text-white"
              : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          All Projects
        </button>
        {/* Category Buttons */}
        {Array.isArray(allCategories) &&
          allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-[var(--primary-main)] text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
              }`}
            >
              {category}
            </button>
          ))}
      </div>
    </div>
  </div>
);

export default CategorySidebar;
