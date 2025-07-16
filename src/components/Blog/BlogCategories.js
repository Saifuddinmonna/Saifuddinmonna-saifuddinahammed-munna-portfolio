import React, { memo, useEffect, useState } from "react";
import { blogCategoryAPI } from "../../services/apiService";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const BlogCategories = memo(({ selectedCategory, handleCategoryChange, activeTab }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [hoveredCategory, setHoveredCategory] = useState(null);
  // Support multi-select
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(selectedCategory)
      ? selectedCategory
      : selectedCategory === "All"
      ? []
      : [selectedCategory]
  );

  useEffect(() => {
    if (activeTab !== "category") return;
    setLoading(true);
    setError(null);
    blogCategoryAPI
      .getAllCategories()
      .then(data => {
        // Convert flat categories to tree structure
        const categoryTree = buildCategoryTree(data || []);
        setCategories(categoryTree);
      })
      .catch(err => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Build category tree from flat structure
  const buildCategoryTree = flatCategories => {
    const categoryMap = {};
    const roots = [];

    // Create map of all categories
    flatCategories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, children: [] };
    });

    // Build tree structure
    flatCategories.forEach(cat => {
      if (cat.parent && categoryMap[cat.parent]) {
        categoryMap[cat.parent].children.push(categoryMap[cat._id]);
      } else {
        roots.push(categoryMap[cat._id]);
      }
    });

    return roots;
  };

  // Toggle category expansion
  const toggleCategory = categoryId => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle category selection (multi-select)
  const handleCategorySelect = categoryId => {
    let updated;
    if (selectedCategories.includes(categoryId)) {
      updated = selectedCategories.filter(id => id !== categoryId);
    } else {
      updated = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updated);
    handleCategoryChange(updated);
  };

  // Find category by ID in tree structure
  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Render category with subcategories (with checkbox for multi-select)
  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories.has(category._id);
    const hasChildren = category.children && category.children.length > 0;
    const isChecked = selectedCategories.includes(category._id);
    const isHovered = hoveredCategory === category._id;

    return (
      <div key={category._id} className="relative">
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
            isChecked
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
          onMouseEnter={() => setHoveredCategory(category._id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCategorySelect(category._id)}
              onClick={e => e.stopPropagation()}
              className="form-checkbox h-4 w-4 text-[var(--primary-main)] border-gray-300 rounded"
            />
            {hasChildren && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleCategory(category._id);
                }}
                className="p-1 hover:bg-[var(--background-default)] rounded transition-colors"
              >
                {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
              </button>
            )}
            <span className="font-medium">{category.name}</span>
            {hasChildren && (
              <span className="text-xs opacity-70">({category.children.length})</span>
            )}
          </div>
        </div>

        {/* Subcategories dropdown */}
        {hasChildren && (
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 border-l-2 border-[var(--border-main)]">
              {category.children.map(child => renderCategory(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (activeTab !== "category") {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-4 text-[var(--text-secondary)]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary-main)] mx-auto mb-2"></div>
        Loading categories...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4">
      {/* All categories button */}
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedCategories([]);
            handleCategoryChange([]);
          }}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            selectedCategories.length === 0
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          All Categories
        </button>
      </div>

      {/* Category tree */}
      <div className="space-y-1">{categories.map(category => renderCategory(category))}</div>

      {/* Quick stats */}
      <div className="mt-4 text-xs text-[var(--text-secondary)] text-center">
        {categories.length} main categories available
      </div>
    </div>
  );
});

BlogCategories.displayName = "BlogCategories";

export default BlogCategories;
