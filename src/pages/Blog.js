import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import BlogHeader from "../components/Blog/BlogHeader";
import BlogSearch from "../components/Blog/BlogSearch";
import BlogGrid from "../components/Blog/BlogGrid";
import BlogPagination from "../components/Blog/BlogPagination";
import BlogLoading from "../components/Blog/BlogLoading";
import BlogError from "../components/Blog/BlogError";
import CreateBlogButton from "../components/Blog/CreateBlogButton";

const Blog = () => {
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
    return <BlogLoading />;
  }

  if (error) {
    return <BlogError error={error} />;
  }

  const { data: blogs, pagination } = data || { data: [], pagination: {} };

  return (
    <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <BlogHeader />

        {/* Search and Filter Section */}
        <BlogSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          handleSearch={handleSearch}
        />

        {/* Blog Posts Grid */}
        <BlogGrid blogs={blogs} />

        {/* Pagination */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={pagination?.pages}
          onPageChange={handlePageChange}
          blogs={blogs}
          totalPosts={pagination?.total}
        />

        {/* Create Blog Button */}
        <CreateBlogButton />
      </div>
    </div>
  );
};

export default Blog;
