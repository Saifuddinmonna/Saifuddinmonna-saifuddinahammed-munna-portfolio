import React, { useState, useMemo, useContext, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { toast } from "react-hot-toast";
import { FaSearch, FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { useDataFetching } from "../../hooks/useDataFetching";
import { useQueryClient } from "@tanstack/react-query";
import BlogGrid from "./BlogGrid";
import BlogLoading from "./BlogLoading";
import BlogError from "./BlogError";
import BlogPagination from "./BlogPagination";
import BlogSearch from "./BlogSearch";
import BlogCategories from "./BlogCategories";
import BlogTabs from "./BlogTabs";
import MemoizedBlogGrid from "./MemoizedBlogGrid";
import BlogViewControls from "./BlogViewControls";
import BlogListView from "./BlogListView";
import BlogTableView from "./BlogTableView";
import BlogDetailsView from "./BlogDetailsView";

const ARTICLES_PER_PAGE = 10;

// Utility to normalize internal anchor links
function normalizeInternalAnchors(html) {
  return html.replace(
    /<a\s+([^>]*?)href=["'](?:https?:\/\/[^\/]+)?\/blog\/[^"'#]+(#_[^"']+)["']/gi,
    '<a $1href="$2"'
  );
}

const Blog = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]); // Now an array for multi-select
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEmpty, setShowEmpty] = useState(false);
  const limit = 10;

  // New view control states
  const [showHeader, setShowHeader] = useState(true);
  const [cardColumns, setCardColumns] = useState(3);
  const [viewMode, setViewMode] = useState("grid");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Custom Load states
  const [isShowingCustom, setIsShowingCustom] = useState(false);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [customBlogs, setCustomBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [customLoadCount, setCustomLoadCount] = useState(10);
  const [showFirstPost, setShowFirstPost] = useState(false);
  const [firstPost, setFirstPost] = useState(null);

  // Load first post immediately for better UX
  useEffect(() => {
    const loadFirstPost = async () => {
      try {
        const response = await blogService.getAllBlogs({
          page: 1,
          limit: 1,
          search: debouncedSearchQuery,
          category: Array.isArray(selectedCategory) && selectedCategory.length > 0
            ? selectedCategory.join(",")
            : "",
        });
        
        if (response.data && response.data.length > 0) {
          setFirstPost(response.data[0]);
          setShowFirstPost(true);
        }
      } catch (error) {
        console.error("Error loading first post:", error);
      }
    };

    loadFirstPost();
  }, [debouncedSearchQuery, selectedCategory]);

  // Optimized data fetching with immediate first post loading
  const { data, isLoading, error, refetch } = useDataFetching(
    ["blogs", currentPage, debouncedSearchQuery, selectedCategory],
    () =>
      blogService.getAllBlogs({
        page: currentPage,
        limit,
        search: debouncedSearchQuery,
        // If selectedCategory is array, join as comma-separated string, else send as is
        category:
          Array.isArray(selectedCategory) && selectedCategory.length > 0
            ? selectedCategory.join(",")
            : "",
      }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      retry: 2,
      keepPreviousData: true,
      select: apiResponse => {
        const blogs = Array.isArray(apiResponse.data) ? apiResponse.data : [];
        const pagination = apiResponse.pagination || {};
        
        // Optimize blog data for faster rendering
        const optimizedBlogs = blogs.map(blog => ({
          ...blog,
          // Truncate content for faster initial load
          content: blog.content ? blog.content.substring(0, 500) + '...' : '',
          // Keep only essential fields for initial display
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          author: blog.author,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          categories: blog.categories,
          tags: blog.tags,
          image: blog.image,
          likes: blog.likes,
          comments: blog.comments,
          readTime: blog.readTime,
          wordCount: blog.wordCount
        }));
        
        return {
          blogs: optimizedBlogs,
          pagination: pagination,
        };
      },
    }
  );
  console.log("data", data);
  console.log("data.blogs", data?.blogs);
  console.log("data.pagination", data?.pagination);
  const blogs = data?.blogs || [];
  const pagination = data?.pagination || {};
  const totalBlogs = pagination.total || 0;
  const totalPages = pagination.pages || Math.ceil(totalBlogs / limit);
  
  // Combine first post with other blogs for display
  const displayBlogs = showFirstPost && firstPost 
    ? [firstPost, ...blogs.filter(blog => blog.id !== firstPost.id)]
    : blogs;
    
  console.log("blogsfrom const blog ", blogs);
  console.log("blogsfrom const pagination ", pagination);
  console.log("displayBlogs", displayBlogs);
  const handleReadMore = article => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handleSearch = useCallback(
    e => {
      e.preventDefault();
      console.log("🔍 Search triggered with query:", searchQuery);
      setCurrentPage(1);
      // Trigger immediate search without debounce
      setDebouncedSearchQuery(searchQuery);
    },
    [searchQuery, setCurrentPage]
  );

  const handleEdit = post => {
    navigate(`/blog/edit/${post.id}`);
  };

  // View control handlers
  const handleToggleHeader = useCallback(() => {
    setShowHeader(prev => !prev);
  }, []);

  const handleCardColumnsChange = useCallback(columns => {
    setCardColumns(columns);
  }, []);

  const handleViewModeChange = useCallback(mode => {
    setViewMode(mode);
  }, []);

  const handleItemsPerPageChange = useCallback(
    items => {
      setItemsPerPage(items);
      setCurrentPage(1); // Reset to first page when changing items per page
    },
    [setCurrentPage]
  );

  // Custom Load handler
  const handleLoadCustom = useCallback(async () => {
    if (isShowingCustom) {
      // Switch back to paginated view
      setIsShowingCustom(false);
      setCustomBlogs([]);
      return;
    }

    setIsLoadingAll(true);
    try {
      // Load custom number of blogs
      const response = await blogService.getAllBlogs({
        page: 1,
        limit: customLoadCount,
        search: debouncedSearchQuery,
        category:
          Array.isArray(selectedCategory) && selectedCategory.length > 0
            ? selectedCategory.join(",")
            : "",
      });

      setCustomBlogs(response.data || []);
      setIsShowingCustom(true);
    } catch (error) {
      console.error("❌ Error loading custom blogs:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoadingAll(false);
    }
  }, [isShowingCustom, customLoadCount, debouncedSearchQuery, selectedCategory]);

  // Load All handler
  const handleLoadAll = useCallback(async () => {
    if (isShowingAll) {
      // Switch back to paginated view
      setIsShowingAll(false);
      setAllBlogs([]);
      return;
    }

    setIsLoadingAll(true);
    try {
      // Load all blogs (up to 200)
      const response = await blogService.getAllBlogs({
        page: 1,
        limit: 200,
        search: debouncedSearchQuery,
        category:
          Array.isArray(selectedCategory) && selectedCategory.length > 0
            ? selectedCategory.join(",")
            : "",
      });

      setAllBlogs(response.data || []);
      setIsShowingAll(true);
    } catch (error) {
      console.error("❌ Error loading all blogs:", error);
      toast.error("Failed to load all posts");
    } finally {
      setIsLoadingAll(false);
    }
  }, [isShowingAll, debouncedSearchQuery, selectedCategory]);

  const handleDelete = async postId => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.deleteBlog(postId);
        refetch();
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleSearchQueryChange = useCallback(e => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback(
    categories => {
      setSelectedCategory(categories);
      setCurrentPage(1);
      setActiveTab("category");
    },
    [setSelectedCategory, setCurrentPage, setActiveTab]
  );

  const handlePageChange = useCallback(page => {
    setCurrentPage(page);
  }, []);

  const handleLike = async postId => {
    try {
      await blogService.toggleLike(postId, {
        name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
        email: user?.email || "",
      });
      refetch();
      toast.success("Like updated successfully");
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  // Debounce search query to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (Array.isArray(blogs) && blogs.length === 0) {
      const timer = setTimeout(() => setShowEmpty(true), 3000); // 3 seconds
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [blogs]);

  // Reset "Custom Load" and "Load All" mode when search or category changes
  useEffect(() => {
    if (isShowingCustom) {
      setIsShowingCustom(false);
      setCustomBlogs([]);
    }
    if (isShowingAll) {
      setIsShowingAll(false);
      setAllBlogs([]);
    }
  }, [debouncedSearchQuery, selectedCategory]);

  const contentRef = useRef(null);

  useEffect(() => {
    if (!showModal) return;
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.style.backgroundColor = "#ffffcc";
          setTimeout(() => {
            el.style.backgroundColor = "";
          }, 2000);
        }
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [showModal, selectedArticle?.content]);

  if (isLoading) {
    return <BlogLoading />;
  }

  if (error) {
    return <BlogError error={error} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background-default)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Redesigned Header Section (Conditional) */}
        {showHeader && (
          <section className="relative mb-16">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)]/30 to-[var(--primary-main)]/10 rounded-3xl blur-sm -z-10"
              style={{ height: "100%", width: "100%" }}
            ></div>
            <div className="text-center py-12 px-4 sm:px-8 rounded-3xl shadow-lg border border-[var(--border-main)] bg-[var(--background-paper)]/80">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">
                <span className="block">Web Development</span>
                <span className="block text-[var(--primary-main)] drop-shadow-lg">
                  Blog & Insights
                </span>
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-medium">
                Stay updated with the latest trends, tips, and insights in web development
              </p>
              {user && (
                <Link
                  to="/blog/new"
                  className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] text-white text-lg font-bold rounded-full shadow-lg hover:from-[var(--primary-dark)] hover:to-[var(--primary-main)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:ring-offset-2"
                >
                  Write New Post
                </Link>
              )}
            </div>
          </section>
        )}

        {/* View Controls */}
        <BlogViewControls
          showHeader={showHeader}
          onToggleHeader={handleToggleHeader}
          cardColumns={cardColumns}
          onCardColumnsChange={handleCardColumnsChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={totalBlogs}
        />

        {/* Header Section (Conditional) */}
        {showHeader && (
          <div className="mb-8">
            <BlogTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSelectedCategory={setSelectedCategory}
              setSearchQuery={setSearchQuery}
            />

            {/* Search Form */}
            <BlogSearch
              searchQuery={searchQuery}
              handleSearchQueryChange={handleSearchQueryChange}
              handleSearch={handleSearch}
            />

            {/* Categories */}
            <BlogCategories
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              activeTab={activeTab}
            />
          </div>
        )}

        {/* Blog Posts - Conditional Rendering based on View Mode */}
        {(() => {
          const displayBlogs = isShowingCustom ? customBlogs : isShowingAll ? allBlogs : blogs;
          const hasBlogs = Array.isArray(displayBlogs) && displayBlogs.length > 0;

          if (!hasBlogs && showEmpty) {
            return (
              <div className="text-center text-[var(--text-secondary)]">No post available</div>
            );
          }

          if (!hasBlogs) {
            return (
              <div className="text-center py-12">
                <div className="text-[var(--text-secondary)] text-lg mb-4">
                  {isShowingCustom
                    ? "No posts found in custom load"
                    : isShowingAll
                    ? "No posts found in all results"
                    : "No posts found"}
                </div>
                <div className="text-[var(--text-secondary)] text-sm">
                  Try adjusting your search or category filters.
                </div>
              </div>
            );
          }

          return (
            <>
              {viewMode === "grid" && (
                <BlogGrid
                  blogs={displayBlogs}
                  handleLike={handleLike}
                  user={user}
                  columns={cardColumns}
                />
              )}
              {viewMode === "list" && (
                <BlogListView blogs={displayBlogs} handleLike={handleLike} user={user} />
              )}
              {viewMode === "table" && (
                <BlogTableView blogs={displayBlogs} handleLike={handleLike} user={user} />
              )}
              {viewMode === "details" && (
                <BlogDetailsView blogs={displayBlogs} handleLike={handleLike} user={user} />
              )}
            </>
          );
        })()}

        {/* Pagination always visible */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          blogs={isShowingCustom ? customBlogs : isShowingAll ? allBlogs : blogs}
          totalPosts={totalBlogs}
          onLoadCustom={handleLoadCustom}
          onLoadAll={handleLoadAll}
          isLoadingAll={isLoadingAll}
          isShowingCustom={isShowingCustom}
          isShowingAll={isShowingAll}
          customLoadCount={customLoadCount}
          setCustomLoadCount={setCustomLoadCount}
          customBlogs={customBlogs}
        />

        {/* Newsletter Section */}
        <div className="mt-16 bg-[var(--primary-main)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Get the latest articles and insights delivered straight to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] bg-[var(--background-paper)] text-[var(--text-primary)]"
            />
            <button className="px-6 py-2 bg-[var(--background-paper)] text-[var(--primary-main)] rounded-lg font-semibold hover:bg-[var(--background-elevated)] transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background-paper)] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-[var(--text-primary)] bg-[var(--background-paper)] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center text-sm text-[var(--text-secondary)] mb-6">
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.readTime}</span>
                <span className="mx-2">•</span>
                <span className="text-[var(--primary-main)]">{selectedArticle.tags[0]}</span>
              </div>
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{
                  __html: normalizeInternalAnchors(selectedArticle.content),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
