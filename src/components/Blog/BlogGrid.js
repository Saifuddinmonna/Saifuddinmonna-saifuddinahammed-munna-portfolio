import React, { memo } from "react";
import BlogCard from "./BlogCard";

const BlogGrid = memo(({ blogs, handleLike, user }) => {
  console.log("\uD83D\uDCCA [BlogGrid] from BlogGrid.js blogs:", blogs);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--text-secondary)] text-lg mb-4">No blogs found.</div>
        <div className="text-[var(--text-secondary)] text-sm">
          Try adjusting your search or category filters.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {blogs.map(blog => (
        <div key={blog._id} className="flex">
          <BlogCard blog={blog} handleLike={handleLike} user={user} />
        </div>
      ))}
    </div>
  );
});

BlogGrid.displayName = "BlogGrid";

export default BlogGrid;
