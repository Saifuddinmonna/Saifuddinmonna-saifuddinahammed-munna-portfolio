import React, { memo, useEffect, useState } from "react";
import { blogCategoryAPI } from "../../services/apiService";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const BlogCategories = memo(({ selectedCategory, handleCategoryChange, activeTab }) => {
  console.log(
    "🔄 BlogCategories re-rendered with category:",
    selectedCategory,
    "activeTab:",
    activeTab
  );
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

  // Auto-expand parent categories when children are selected
  useEffect(() => {
    const newExpanded = new Set(expandedCategories);
    let hasChanges = false;

    categories.forEach(category => {
      if (category.children && category.children.length > 0) {
        const hasSelectedChild = category.children.some(child =>
          selectedCategories.includes(child._id)
        );

        if (hasSelectedChild && !newExpanded.has(category._id)) {
          newExpanded.add(category._id);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setExpandedCategories(newExpanded);
    }
  }, [selectedCategories, categories]);

  // Handle category selection with parent-child relationship
  const handleCategorySelect = categoryId => {
    const category = findCategoryById(categories, categoryId);
    if (!category) return;

    let updated;

    if (selectedCategories.includes(categoryId)) {
      // Remove this category and all its children
      const categoryIdsToRemove = [categoryId];
      if (category.children && category.children.length > 0) {
        const getAllChildIds = cat => {
          const childIds = [];
          if (cat.children) {
            cat.children.forEach(child => {
              childIds.push(child._id);
              childIds.push(...getAllChildIds(child));
            });
          }
          return childIds;
        };
        categoryIdsToRemove.push(...getAllChildIds(category));
      }

      updated = selectedCategories.filter(id => !categoryIdsToRemove.includes(id));
    } else {
      // Add this category and all its children
      const categoryIdsToAdd = [categoryId];
      if (category.children && category.children.length > 0) {
        const getAllChildIds = cat => {
          const childIds = [];
          if (cat.children) {
            cat.children.forEach(child => {
              childIds.push(child._id);
              childIds.push(...getAllChildIds(child));
            });
          }
          return childIds;
        };
        categoryIdsToAdd.push(...getAllChildIds(category));
      }

      updated = [...selectedCategories, ...categoryIdsToAdd];
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

    // Check if any children are selected
    const hasSelectedChildren =
      hasChildren && category.children.some(child => selectedCategories.includes(child._id));

    // Check if all children are selected
    const allChildrenSelected =
      hasChildren && category.children.every(child => selectedCategories.includes(child._id));

    return (
      <div key={category._id} className="relative">
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
            isChecked
              ? "bg-[var(--primary-main)] text-white"
              : hasSelectedChildren
              ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
          onMouseEnter={() => setHoveredCategory(category._id)}
          onMouseLeave={() => setHoveredCategory(null)}
          onClick={() => handleCategorySelect(category._id)}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCategorySelect(category._id);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Select ${category.name} category`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                isChecked
                  ? "bg-[var(--primary-main)] border-[var(--primary-main)]"
                  : hasSelectedChildren
                  ? "bg-[var(--primary-light)] border-[var(--primary-light)]"
                  : "border-gray-300"
              }`}
            >
              {isChecked && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {hasSelectedChildren && !isChecked && (
                <div className="w-2 h-2 bg-[var(--primary-dark)] rounded"></div>
              )}
            </div>
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
              <span className="text-xs opacity-70">
                ({category.children.length}{" "}
                {allChildrenSelected
                  ? "all selected"
                  : hasSelectedChildren
                  ? "some selected"
                  : "subcategories"}
                )
              </span>
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
          className={`px-4 py-2 rounded-lg transition-colors duration-300 shadow-[var(--shadow-sm)] ${
            selectedCategories.length === 0
              ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-md)]"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)] hover:shadow-[var(--shadow-md)] border border-[var(--border-main)]"
          }`}
        >
          All Categories
        </button>
      </div>

      {/* Category tree */}
      <div className="space-y-1 bg-[var(--background-paper)] rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)] p-2">
        {categories.map(category => renderCategory(category))}
      </div>

      {/* Quick stats */}
      <div className="mt-4 text-xs text-[var(--text-secondary)] text-center bg-[var(--background-paper)] p-2 rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
        <span className="font-medium text-[var(--text-primary)]">{categories.length}</span> main
        categories available •{" "}
        <span className="font-medium text-[var(--primary-main)]">{selectedCategories.length}</span>{" "}
        selected
      </div>

      {/* Selection info */}
      {selectedCategories.length > 0 && (
        <div className="mt-2 p-3 bg-[var(--background-elevated)] rounded-lg text-xs text-[var(--text-secondary)] border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
          <div className="font-medium mb-2 text-[var(--text-primary)]">Selected Categories:</div>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map(catId => {
              const category = findCategoryById(categories, catId);
              return category ? (
                <span
                  key={catId}
                  className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] rounded text-xs font-medium shadow-[var(--shadow-sm)]"
                >
                  {category.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
});

BlogCategories.displayName = "BlogCategories";

export default BlogCategories;
