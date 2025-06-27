import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { blogService } from "../services/blogService";
import Pagination from "../components/ui/Pagination";
import { useAuth } from "../auth/context/AuthContext";

const Blog = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const limit = 10; // Number of posts per page

  // Fetch blogs with pagination and filters
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", currentPage, searchTerm, selectedCategory],
    queryFn: async () => {
      try {
        console.log("Fetching blogs with params:", {
          page: currentPage,
          limit,
          search: searchTerm,
          category: selectedCategory,
        });
        const response = await blogService.getAllBlogs({
          page: currentPage,
          limit,
          search: searchTerm,
          category: selectedCategory,
        });
        console.log("Blog response:", response);
        return response;
      } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
    },
  });

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  if (isLoading) {
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
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-500">Error loading blog posts: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const { data: blogs, pagination } = data || { data: [], pagination: {} };

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Our Blog</h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Explore our latest articles, tutorials, and insights about web development, programming,
            and technology.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="flex-1 px-4 py-2 rounded-lg bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === ""
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange("Web Development")}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === "Web Development"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)]"
              }`}
            >
              Web Development
            </button>
            <button
              onClick={() => handleCategoryChange("JavaScript")}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === "JavaScript"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)]"
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => handleCategoryChange("React")}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === "React"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)]"
              }`}
            >
              React
            </button>
            <button
              onClick={() => handleCategoryChange("Node.js")}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === "Node.js"
                  ? "bg-[var(--primary-main)] text-white"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)]"
              }`}
            >
              Node.js
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div
              key={blog._id}
              className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {blog.image && (
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary-main)] rounded-full text-sm">
                    {blog.tags[0]}
                  </span>
                  <span className="text-[var(--text-secondary)] text-sm">{blog.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{blog.title}</h2>
                <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                  {blog.content.replace(/<[^>]*>/g, "")}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                      <span className="text-[var(--primary-main)] font-bold">
                        {blog.author.name[0]}
                      </span>
                    </div>
                    <span className="text-[var(--text-primary)]">{blog.author.name}</span>
                  </div>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-300"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
            <div className="text-center mt-4 text-[var(--text-secondary)]">
              Showing {blogs.length} of {pagination.total} posts
            </div>
          </div>
        )}

        {/* Create Blog Button */}
        {user && (
          <div className="fixed bottom-8 right-8">
            <Link
              to="/blog/create"
              className="bg-[var(--primary-main)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
