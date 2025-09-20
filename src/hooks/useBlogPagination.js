import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook for managing blog post pagination with lazy loading
 * @param {string} content - The full blog content HTML
 * @param {number} wordsPerPage - Number of words per page (default: 250 - standard reading)
 * @param {number} minWordsPerPage - Minimum words per page (default: 200)
 */
export const useBlogPagination = (content, wordsPerPage = 250, minWordsPerPage = 200) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Split content into pages
  const paginatedContent = useMemo(() => {
    console.log("📄 useBlogPagination - Content changed, recalculating pagination");
    console.log("📄 useBlogPagination - Content length:", content?.length);
    console.log("📄 useBlogPagination - Content preview:", content?.substring(0, 100));

    if (!content) return { pages: [], totalPages: 0, totalWords: 0, wordCounts: [] };

    // Remove HTML tags and get plain text for word counting
    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = plainText.split(" ").filter(word => word.length > 0);
    const totalWords = words.length;

    if (totalWords <= wordsPerPage) {
      return {
        pages: [content],
        totalPages: 1,
        totalWords,
        wordCounts: [totalWords],
      };
    }

    // Split content into pages
    const pages = [];
    const wordCounts = [];
    let currentWordCount = 0;
    let currentPageContent = "";
    let currentWordIndex = 0;

    // Split by HTML structure first (paragraphs, headings, etc.)
    const htmlElements = content.split(/(<[^>]+>)/);
    let tempContent = "";

    for (let i = 0; i < htmlElements.length; i++) {
      const element = htmlElements[i];
      tempContent += element;

      // If it's a text element (not HTML tag), count words
      if (!element.startsWith("<")) {
        const elementWords = element.split(" ").filter(word => word.length > 0);
        currentWordCount += elementWords.length;
      }

      // Check if we should create a new page
      if (currentWordCount >= wordsPerPage || i === htmlElements.length - 1) {
        // Ensure minimum words per page (except for the last page)
        if (currentWordCount >= minWordsPerPage || i === htmlElements.length - 1) {
          pages.push(tempContent.trim());
          wordCounts.push(currentWordCount);
          tempContent = "";
          currentWordCount = 0;
        }
      }
    }

    // If we have remaining content, add it to the last page
    if (tempContent.trim()) {
      if (pages.length > 0) {
        pages[pages.length - 1] += tempContent.trim();
        wordCounts[wordCounts.length - 1] += currentWordCount;
      } else {
        pages.push(tempContent.trim());
        wordCounts.push(currentWordCount);
      }
    }

    return {
      pages,
      totalPages: pages.length,
      totalWords,
      wordCounts: wordCounts.length > 0 ? wordCounts : pages.map(() => 0),
    };
  }, [content, wordsPerPage, minWordsPerPage]);

  // Get current page content
  const currentPageContent = useMemo(() => {
    if (!paginatedContent.pages || paginatedContent.pages.length === 0) return "";
    return paginatedContent.pages[currentPage - 1] || "";
  }, [paginatedContent.pages, currentPage]);

  // Get current page word count
  const currentPageWordCount = useMemo(() => {
    if (!paginatedContent.wordCounts || paginatedContent.wordCounts.length === 0) return 0;
    return paginatedContent.wordCounts[currentPage - 1] || 0;
  }, [paginatedContent.wordCounts, currentPage]);

  // Calculate reading progress
  const readingProgress = useMemo(() => {
    if (!paginatedContent.totalPages || paginatedContent.totalPages === 0) return 0;
    return Math.round((currentPage / paginatedContent.totalPages) * 100);
  }, [currentPage, paginatedContent.totalPages]);

  // Calculate estimated reading time for current page
  const currentPageReadTime = useMemo(() => {
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(currentPageWordCount / wordsPerMinute);
    return minutes;
  }, [currentPageWordCount]);

  // Navigation functions
  const goToPage = page => {
    console.log("📄 useBlogPagination - goToPage called with page:", page);
    console.log("📄 useBlogPagination - Current page before change:", currentPage);
    console.log("📄 useBlogPagination - Total pages:", paginatedContent.totalPages);
    console.log(
      "📄 useBlogPagination - Page validation:",
      page >= 1 && page <= (paginatedContent.totalPages || 1)
    );

    if (page >= 1 && page <= (paginatedContent.totalPages || 1)) {
      console.log("📄 useBlogPagination - Setting page to:", page);
      setIsLoading(true);
      setCurrentPage(page);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsLoading(false);
        console.log("📄 useBlogPagination - Loading completed, page is now:", page);
      }, 300);
    } else {
      console.log("📄 useBlogPagination - Invalid page number:", page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < (paginatedContent.totalPages || 1)) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(paginatedContent.totalPages || 1);
  };

  // Reset to first page when content changes
  useEffect(() => {
    console.log("📄 useBlogPagination - Content changed, resetting to page 1");
    setCurrentPage(1);
  }, [content]);

  // Debug currentPage changes
  useEffect(() => {
    console.log("📄 useBlogPagination - currentPage changed to:", currentPage);
  }, [currentPage]);

  return {
    // Current state
    currentPage,
    totalPages: paginatedContent.totalPages || 0,
    totalWords: paginatedContent.totalWords || 0,
    currentPageContent,
    currentPageWordCount,
    readingProgress,
    currentPageReadTime,
    isLoading,

    // Navigation functions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,

    // Page info
    hasNextPage: currentPage < (paginatedContent.totalPages || 1),
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === (paginatedContent.totalPages || 1),

    // Word counts for each page
    wordCounts: paginatedContent.wordCounts || [],
  };
};
