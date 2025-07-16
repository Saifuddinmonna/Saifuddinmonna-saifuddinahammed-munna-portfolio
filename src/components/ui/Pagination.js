import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-light)] transition-colors duration-300"
      >
        ««
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-light)] transition-colors duration-300"
      >
        «
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === page
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-light)]"
          } transition-colors duration-300`}
        >
          {page}
        </button>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-light)] transition-colors duration-300"
      >
        »
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-light)] transition-colors duration-300"
      >
        »»
      </button>
    </div>
  );
};

export default Pagination;
