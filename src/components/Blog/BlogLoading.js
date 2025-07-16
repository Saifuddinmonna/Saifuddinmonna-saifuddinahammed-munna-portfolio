import React from "react";

const BlogLoading = () => {
  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-primary)]">Loading blog posts...</p>
        </div>
      </div>
    </div>
  );
};

export default BlogLoading;
