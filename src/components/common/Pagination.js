import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 pages at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    return pages.slice(start - 1, end);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--primary-main)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft />
      </button>

      {getVisiblePages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-[var(--primary-main)] text-white"
              : "bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--primary-main)] hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--primary-main)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
