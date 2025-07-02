import React from "react";
import Pagination from "../ui/Pagination";

const BlogPagination = ({ currentPage, totalPages, onPageChange, blogs, totalPosts }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <div className="text-center mt-4 text-[var(--text-secondary)]">
        Showing {blogs.length} of {totalPosts} posts hello render kuthai hosse
      </div>
    </div>
  );
};

export default BlogPagination;
