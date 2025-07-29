import React, { memo, useCallback } from "react";

const BlogTabsOptimized = memo(({ activeTab, onTabChange }) => {
  const handleTabClick = useCallback(
    tabName => {
      onTabChange(tabName);
    },
    [onTabChange]
  );

  const tabs = [
    { id: "all", label: "All Posts", icon: "📄" },
    { id: "category", label: "Categories", icon: "📂" },
    { id: "featured", label: "Featured", icon: "⭐" },
    { id: "recent", label: "Recent", icon: "🕒" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-[var(--primary-main)] text-white shadow-lg"
              : "bg-[var(--background-paper)] text-[var(--text-secondary)] hover:bg-[var(--background-elevated)] hover:text-[var(--text-primary)]"
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>
  );
});

BlogTabsOptimized.displayName = "BlogTabsOptimized";

export default BlogTabsOptimized;
