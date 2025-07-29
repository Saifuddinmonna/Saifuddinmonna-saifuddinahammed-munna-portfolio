import React, { memo } from "react";
import Pagination from "../ui/Pagination";
import { FaDownload, FaList } from "react-icons/fa";

const BlogPagination = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    blogs,
    totalPosts,
    onLoadCustom,
    onLoadAll,
    isLoadingAll,
    isShowingCustom,
    isShowingAll,
    customLoadCount,
    setCustomLoadCount,
    customBlogs,
  }) => {
    console.log(
      "🔄 BlogPagination re-rendered with currentPage:",
      currentPage,
      "totalPages:",
      totalPages
    );

    return (
      <div className="mt-12">
        {/* Load Options Section */}
        <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-[var(--background-paper)] rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
          {/* Custom Load */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Load Posts:</span>
            <input
              type="number"
              min="1"
              max="200"
              placeholder="10"
              className="w-20 px-3 py-2 text-sm border border-[var(--border-main)] rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] transition-colors duration-200"
              value={customLoadCount}
              onChange={e => setCustomLoadCount(parseInt(e.target.value) || 10)}
            />
            <button
              onClick={onLoadCustom}
              disabled={isLoadingAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isShowingCustom
                  ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
              } ${isLoadingAll ? "opacity-50 cursor-not-allowed" : ""}`}
              title={`Load ${customLoadCount} posts`}
            >
              {isLoadingAll ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaDownload />
              )}
              <span>Load {customLoadCount}</span>
            </button>
          </div>

          {/* All Load */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLoadAll}
              disabled={isLoadingAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isShowingAll
                  ? "bg-[var(--primary-main)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
              } ${isLoadingAll ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Load all posts (1-200)"
            >
              {isLoadingAll ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaDownload />
              )}
              <span>Load All</span>
            </button>
          </div>

          {/* Status Indicators */}
          {isShowingCustom && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--background-elevated)] px-3 py-1 rounded-lg">
              <FaList className="text-[var(--primary-main)]" />
              <span>{customBlogs.length} posts loaded (Custom)</span>
            </div>
          )}

          {isShowingAll && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--background-elevated)] px-3 py-1 rounded-lg">
              <FaList className="text-[var(--primary-main)]" />
              <span>All {totalPosts} posts loaded</span>
            </div>
          )}
        </div>

        {/* Regular Pagination - Only show if not showing custom load or all */}
        {!isShowingCustom && !isShowingAll && totalPages > 1 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
            <div className="text-center mt-4 text-[var(--text-secondary)] bg-[var(--background-paper)] p-3 rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-center gap-2">
                <FaList className="text-[var(--primary-main)]" />
                <span>
                  Showing {blogs.length} of {totalPosts} posts (Page {currentPage} of {totalPages})
                </span>
              </div>
            </div>
          </>
        )}

        {/* Show info when displaying custom loaded posts */}
        {isShowingCustom && (
          <div className="text-center mt-4 text-[var(--text-secondary)] bg-[var(--background-paper)] p-3 rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-center gap-2">
              <FaList className="text-[var(--primary-main)]" />
              <span>Showing {customBlogs.length} posts (Custom Load)</span>
            </div>
          </div>
        )}

        {/* Show info when displaying all posts */}
        {isShowingAll && (
          <div className="text-center mt-4 text-[var(--text-secondary)] bg-[var(--background-paper)] p-3 rounded-lg border border-[var(--border-main)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-center gap-2">
              <FaList className="text-[var(--primary-main)]" />
              <span>Showing all {totalPosts} posts</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

BlogPagination.displayName = "BlogPagination";

export default BlogPagination;
