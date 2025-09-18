import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBookOpen,
  FaClock,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import "./BlogPagination.css";

const BlogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  onLastPage,
  hasNextPage,
  hasPreviousPage,
  isLoading = false,
  currentPageWordCount = 0,
  currentPageReadTime = 0,
  readingProgress = 0,
  className = "",
}) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [showPageInput, setShowPageInput] = useState(false);

  // Update page input when current page changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Handle page input submission
  const handlePageInputSubmit = e => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setShowPageInput(false);
    }
  };

  // Handle page input change
  const handlePageInputChange = e => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= totalPages)) {
      setPageInput(value);
    }
  };

  // Generate page numbers to display (optimized for full width)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 25; // Increased for full width display

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end pages with more visible pages
      let startPage = Math.max(2, currentPage - 8);
      let endPage = Math.min(totalPages - 1, currentPage + 8);

      // Adjust if we're near the beginning or end
      if (currentPage <= 9) {
        endPage = Math.min(15, totalPages - 1);
      }
      if (currentPage >= totalPages - 8) {
        startPage = Math.max(2, totalPages - 14);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <div className={`blog-pagination ${className}`}>
      {/* Main Pagination Controls */}
      <div className="pagination-main-container">
        {/* Left Side - Navigation Buttons */}
        <div className="pagination-nav-buttons">
          <button
            onClick={onFirstPage}
            disabled={!hasPreviousPage || isLoading}
            className="pagination-nav-btn"
            title="First page"
            data-nav="first"
          >
            <FaAngleDoubleLeft size={14} />
          </button>

          <button
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || isLoading}
            className="pagination-nav-btn"
            title="Previous page"
            data-nav="prev"
          >
            <FaChevronLeft size={14} />
          </button>
        </div>

        {/* Center - Page Numbers and Input (Full Width) */}
        <div className="pagination-center">
          {/* Page Numbers */}
          <div className="pagination-numbers">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 py-1 text-[var(--text-secondary)] text-sm">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`page-number-btn px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? "bg-[var(--primary-main)] text-white shadow-md"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background-default)] hover:text-[var(--text-primary)]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    data-page={page}
                    data-current={page === currentPage}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page Input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Go to:</span>
            {showPageInput ? (
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={handlePageInputChange}
                  className="w-16 px-2 py-1 text-sm border border-[var(--border-main)] rounded-md bg-[var(--background-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                  title="Go to page"
                >
                  <FaSearch size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPageInput(false);
                    setPageInput(currentPage.toString());
                  }}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  title="Cancel"
                >
                  <FaTimes size={12} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowPageInput(true)}
                className="px-3 py-1 text-sm border border-[var(--border-main)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--background-default)] hover:text-[var(--text-primary)] transition-colors duration-200"
                title="Go to specific page"
              >
                {currentPage} / {totalPages}
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Navigation Buttons */}
        <div className="pagination-nav-buttons">
          <button
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
            className="pagination-nav-btn"
            title="Next page"
            data-nav="next"
          >
            <FaChevronRight size={14} />
          </button>

          <button
            onClick={onLastPage}
            disabled={!hasNextPage || isLoading}
            className="pagination-nav-btn"
            title="Last page"
            data-nav="last"
          >
            <FaAngleDoubleRight size={14} />
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center mt-4 loading-indicator">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
          <span className="ml-2 text-sm text-[var(--text-secondary)]">Loading page...</span>
        </div>
      )}

      {/* Keyboard Navigation Hint */}
      <div className="mt-3 text-center text-xs text-[var(--text-secondary)] keyboard-hint">
        Use ← → arrow keys or click page numbers to navigate
      </div>
    </div>
  );
};

export default BlogPagination;
