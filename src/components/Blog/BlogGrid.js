import React from "react";
import BlogCard from "./BlogCard";

const BlogGrid = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <div className="text-center text-[var(--text-secondary)]">No blogs found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {blogs.map(blog => (
        <div key={blog._id} className="h-[400px]">
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
};

export default BlogGrid;
