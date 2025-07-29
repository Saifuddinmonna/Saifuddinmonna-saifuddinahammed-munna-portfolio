import React, { useState, useMemo, useCallback, useEffect } from "react";
import { blogService } from "../../services/blogService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../auth/context/AuthContext";
import BlogCard from "./BlogCard";
import BlogOptimizationTest from "./BlogOptimizationTest";

const BlogCardContainer = ({ searchQuery, selectedCategory, currentPage, onDataChange }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const { user } = useAuth();

  // Memoize the API call parameters to prevent unnecessary calls
  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      category:
        Array.isArray(selectedCategory) && selectedCategory.length > 0
          ? selectedCategory.join(",")
          : "",
    }),
    [currentPage, searchQuery, selectedCategory]
  );

  console.log("BlogCardContainer - API Params:", apiParams);

  // Fetch blogs with memoized parameters
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await blogService.getAllBlogs(apiParams);
      console.log("BlogCardContainer - API Response:", response);

      // Handle different response structures
      let blogsData = [];
      let paginationData = {};

      if (response && Array.isArray(response)) {
        // If response is directly an array of blogs
        blogsData = response;
        paginationData = { total: response.length, pages: 1 };
      } else if (response && response.data && Array.isArray(response.data)) {
        // If response has data property with array
        blogsData = response.data;
        paginationData = response.pagination || { total: response.data.length, pages: 1 };
      } else if (response && Array.isArray(response.blogs)) {
        // If response has blogs property
        blogsData = response.blogs;
        paginationData = response.pagination || { total: response.blogs.length, pages: 1 };
      } else {
        // Fallback
        blogsData = [];
        paginationData = { total: 0, pages: 0 };
      }

      console.log("BlogCardContainer - Processed blogs:", blogsData);
      console.log("BlogCardContainer - Processed pagination:", paginationData);

      setBlogs(blogsData);
      setPagination(paginationData);

      // Notify parent component about data change
      if (onDataChange) {
        onDataChange({
          blogs: blogsData,
          pagination: paginationData,
          totalBlogs: paginationData.total || 0,
          totalPages: paginationData.pages || Math.ceil((paginationData.total || 0) / 10),
        });
      }
    } catch (err) {
      console.error("BlogCardContainer - Error fetching blogs:", err);
      setError(err.message || "Failed to fetch blogs");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [apiParams, onDataChange]);

  // Fetch blogs when parameters change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle like functionality
  const handleLike = useCallback(
    async postId => {
      try {
        await blogService.toggleLike(postId, {
          name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
          email: user?.email || "",
        });

        // Refetch blogs to update like count
        await fetchBlogs();
        toast.success("Like updated successfully");
      } catch (error) {
        toast.error("Failed to update like");
      }
    },
    [user, fetchBlogs]
  );

  // Memoize the blogs array to prevent unnecessary re-renders
  const memoizedBlogs = useMemo(() => blogs, [blogs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-[var(--background-paper)] rounded-xl overflow-hidden shadow-lg animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading blogs</div>
        <button
          onClick={fetchBlogs}
          className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!memoizedBlogs || memoizedBlogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--text-secondary)] text-lg mb-4">
          {error ? `Error: ${error}` : "No blogs found."}
        </div>
        <div className="text-[var(--text-secondary)] text-sm">
          {error
            ? "Please check your connection and try again."
            : "Try adjusting your search or category filters."}
        </div>
        {error && (
          <button
            onClick={fetchBlogs}
            className="mt-4 px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <BlogOptimizationTest
        componentName="BlogCardContainer"
        props={{ searchQuery, selectedCategory, currentPage }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {memoizedBlogs.map(blog => (
          <div key={blog._id} className="flex">
            <BlogCard blog={blog} handleLike={handleLike} user={user} />
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(BlogCardContainer);
