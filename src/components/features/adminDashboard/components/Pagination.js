import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            currentPage === page
              ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
              : "border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
