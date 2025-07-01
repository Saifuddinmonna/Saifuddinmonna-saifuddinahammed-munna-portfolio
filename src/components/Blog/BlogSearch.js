import React from "react";

const BlogSearch = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  handleCategoryChange,
  handleSearch,
}) => {
  const categories = ["All", "Web Development", "JavaScript", "React", "Node.js"];

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="flex-1 px-4 py-2 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
        >
          Search
        </button>
      </form>

      {/* Category Filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category === "All" ? "" : category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === (category === "All" ? "" : category)
                ? "bg-[var(--primary-main)] text-white"
                : "bg-[var(--background-paper)] text-[var(--text-primary)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogSearch;
