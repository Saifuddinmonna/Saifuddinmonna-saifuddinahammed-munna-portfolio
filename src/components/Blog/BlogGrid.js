import React, { memo } from "react";
import BlogCard from "./BlogCard";

const BlogGrid = memo(({ blogs, handleLike, user, columns = 3 }) => {
  console.log("🔄 BlogGrid re-rendered with", blogs.length, "blogs, columns:", columns);

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

  // Dynamic grid classes based on columns
  const getGridClasses = cols => {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    };
    return gridClasses[cols] || gridClasses[3];
  };

  return (
    <div className={`grid ${getGridClasses(columns)} gap-4 sm:gap-6`}>
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
