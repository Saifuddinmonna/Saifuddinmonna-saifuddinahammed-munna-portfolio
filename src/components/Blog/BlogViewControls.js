import React, { memo } from "react";
import { FaEye, FaEyeSlash, FaTh, FaList, FaTable, FaFileAlt, FaCog } from "react-icons/fa";

const BlogViewControls = memo(
  ({
    showHeader,
    onToggleHeader,
    cardColumns,
    onCardColumnsChange,
    viewMode,
    onViewModeChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
  }) => {
    const columnOptions = [1, 2, 3, 4, 5];
    const viewModes = [
      { id: "grid", label: "Grid", icon: FaTh },
      { id: "list", label: "List", icon: FaList },
      { id: "table", label: "Table", icon: FaTable },
      { id: "details", label: "Details", icon: FaFileAlt },
    ];

    return (
      <div className="bg-[var(--background-paper)] rounded-lg p-4 mb-6 border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Header Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleHeader}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showHeader
                  ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
              }`}
              title={showHeader ? "Hide Blog Header" : "Show Blog Header"}
            >
              {showHeader ? <FaEye /> : <FaEyeSlash />}
              <span>Blog Header</span>
            </button>
          </div>

          {/* Card Columns */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Columns:</span>
            <div className="flex gap-1">
              {columnOptions.map(cols => (
                <button
                  key={cols}
                  onClick={() => onCardColumnsChange(cols)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    cardColumns === cols
                      ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-sm)]"
                      : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
                  }`}
                >
                  {cols}
                </button>
              ))}
            </div>
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] font-medium">View:</span>
            <div className="flex gap-1">
              {viewModes.map(mode => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onViewModeChange(mode.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                      viewMode === mode.id
                        ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-sm)]"
                        : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
                    }`}
                    title={mode.label}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Items:</span>
            <input
              type="number"
              min="1"
              max="200"
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(parseInt(e.target.value) || 10)}
              className="w-16 px-2 py-1 text-sm border border-[var(--border-main)] rounded bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] transition-colors duration-200"
            />
            <span className="text-xs text-[var(--text-secondary)]">/ {totalItems}</span>
          </div>
        </div>
      </div>
    );
  }
);

BlogViewControls.displayName = "BlogViewControls";

export default BlogViewControls;
