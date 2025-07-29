import React, { memo, useEffect, useState, useCallback } from "react";
import { blogCategoryAPI } from "../../services/apiService";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const BlogCategoriesOptimized = memo(({ selectedCategory, onCategoryChange, activeTab }) => {
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

  // Build category tree from flat structure
  const buildCategoryTree = useCallback(flatCategories => {
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
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (activeTab !== "category") return;

    setLoading(true);
    setError(null);

    try {
      const data = await blogCategoryAPI.getAllCategories();
      const categoryTree = buildCategoryTree(data || []);
      setCategories(categoryTree);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [activeTab, buildCategoryTree]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Toggle category expansion
  const toggleCategory = useCallback(categoryId => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Handle category selection (multi-select)
  const handleCategorySelect = useCallback(
    categoryId => {
      let updated;
      if (selectedCategories.includes(categoryId)) {
        updated = selectedCategories.filter(id => id !== categoryId);
      } else {
        updated = [...selectedCategories, categoryId];
      }
      setSelectedCategories(updated);
      onCategoryChange(updated);
    },
    [selectedCategories, onCategoryChange]
  );

  // Find category by ID in tree structure
  const findCategoryById = useCallback((categories, id) => {
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Render category with subcategories (with checkbox for multi-select)
  const renderCategory = useCallback(
    (category, level = 0) => {
      const isExpanded = expandedCategories.has(category._id);
      const hasChildren = category.children && category.children.length > 0;
      const isChecked = selectedCategories.includes(category._id);
      const isHovered = hoveredCategory === category._id;

      return (
        <div key={category._id} className="mb-2">
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isHovered
                ? "bg-[var(--primary-light)]/20 border-[var(--primary-main)]/30"
                : "hover:bg-[var(--background-elevated)]"
            } ${isChecked ? "bg-[var(--primary-light)]/30 border-[var(--primary-main)]" : ""}`}
            onMouseEnter={() => setHoveredCategory(category._id)}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
          >
            <div className="flex items-center gap-2 flex-1">
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="p-1 hover:bg-[var(--primary-light)] rounded transition-colors duration-200"
                >
                  {isExpanded ? (
                    <FaChevronDown className="w-3 h-3 text-[var(--primary-main)]" />
                  ) : (
                    <FaChevronRight className="w-3 h-3 text-[var(--primary-main)]" />
                  )}
                </button>
              )}

              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategorySelect(category._id)}
                  className="w-4 h-4 text-[var(--primary-main)] bg-[var(--background-paper)] border-[var(--border-main)] rounded focus:ring-[var(--primary-main)] focus:ring-2"
                />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {category.name}
                </span>
              </label>
            </div>
          </div>

          {/* Render subcategories if expanded */}
          {hasChildren && isExpanded && (
            <div className="ml-4">
              {category.children.map(child => renderCategory(child, level + 1))}
            </div>
          )}
        </div>
      );
    },
    [expandedCategories, selectedCategories, hoveredCategory, toggleCategory, handleCategorySelect]
  );

  if (activeTab !== "category") {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-[var(--background-paper)] rounded-lg p-4 border border-[var(--border-main)]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--background-paper)] rounded-lg p-4 border border-[var(--border-main)]">
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={fetchCategories}
          className="mt-2 px-3 py-1 bg-[var(--primary-main)] text-white rounded text-sm hover:bg-[var(--primary-dark)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background-paper)] rounded-lg p-4 border border-[var(--border-main)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Categories</h3>
      <div className="space-y-1">{categories.map(category => renderCategory(category))}</div>
    </div>
  );
});

BlogCategoriesOptimized.displayName = "BlogCategoriesOptimized";

export default BlogCategoriesOptimized;
