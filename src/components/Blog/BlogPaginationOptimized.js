import React, { memo, useCallback } from "react";

const BlogPaginationOptimized = memo(({ currentPage, totalPages, onPageChange, totalPosts }) => {
  const handlePageClick = useCallback(
    page => {
      onPageChange(page);
    },
    [onPageChange]
  );

  const handlePrevClick = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextClick = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Posts count */}
      <div className="text-sm text-[var(--text-secondary)]">Showing {totalPosts} posts</div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === 1
              ? "bg-[var(--background-elevated)] text-[var(--text-secondary)] cursor-not-allowed"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-main)]"
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => (typeof page === "number" ? handlePageClick(page) : null)}
              disabled={page === "..."}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === "..."
                  ? "text-[var(--text-secondary)] cursor-default"
                  : page === currentPage
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-main)]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-[var(--background-elevated)] text-[var(--text-secondary)] cursor-not-allowed"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-main)]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
});

BlogPaginationOptimized.displayName = "BlogPaginationOptimized";

export default BlogPaginationOptimized;
