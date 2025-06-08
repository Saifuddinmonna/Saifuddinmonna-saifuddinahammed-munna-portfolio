import React, { useEffect, useState, useContext, useCallback } from "react";
import ReactConfetti from "react-confetti";
import GalleryGrid from "../components/Gallery/GalleryGrid";
import Lightbox from "../components/Gallery/Lightbox"; // Import your Lightbox
import portfoliosData from "../components/MyPortfolios/portfolios.json";
import NavbarPage from "../components/NavbarPage/NavbarPage"; // Corrected import
import Footer from "../components/CommonComponents/Footer";
import { ThemeContext } from "../App";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FaSearch,
  FaThLarge,
  FaList, // Assuming you might want a list view for GalleryGrid
  FaSort,
  FaPalette,
  FaTags,
} from "react-icons/fa";

// Add Google Fonts (consistent with PortfolioLayout)
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
`;

// Constants
const CONFETTI_DURATION = 5000;

const SORT_OPTIONS = {
  NEWEST: "newest", // Assuming 'id' or index can determine newest
  OLDEST: "oldest",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
};

const VIEW_MODES = {
  GRID_AUTO: "grid-auto", // Let GalleryGrid decide based on its internal logic
  // You can add more if GalleryGrid supports them, e.g., GRID_2, GRID_3
  // LIST: "list", // If GalleryGrid can render items as a list
};

// Helper to prepare initial gallery data in the format GalleryItem/Lightbox expect
const prepareGalleryData = () => {
  return portfoliosData
    .flatMap((project, projectIndex) =>
      project.image.map(img => ({
        src: `/images/${img}`,
        alt: `${project.name} - ${img}`,
        title: project.name,
        description: project.category,
        projectData: {
          name: project.name,
          id: project.id || `proj-${projectIndex}`, // Ensure an ID for sorting
          category: project.category,
          liveWebsite: project.liveWebsite,
          liveWebsiteRepo: project.liveWebsiteRepo,
          liveServersite: project.liveServersite,
          liveServersiteRepo: project.liveServersiteRepo,
          technology: project.technology,
          overview: project.overview,
        },
      }))
    )
    .sort((a, b) => (b.projectData.id || 0) - (a.projectData.id || 0)); // Default sort by newest if id exists
};

// Tooltip Component (reusable)
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] text-sm rounded-md shadow-lg border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--background-elevated)]"></div>
    </div>
  </div>
);

const GalleryPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  useSpring(scrollYProgress);

  const [confettiStart, setConfettiStart] = useState(true);
  const [galleryData, setGalleryData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID_AUTO);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImageForLightbox, setSelectedImageForLightbox] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const data = prepareGalleryData();
    setGalleryData(data);
    setIsLoading(false);
  }, []);

  const filterAndSortData = useCallback(() => {
    let filteredData = [...galleryData];

    if (selectedCategory) {
      filteredData = filteredData.filter(item => item.projectData.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.projectData.category.toLowerCase().includes(query) ||
          (item.projectData.technology &&
            typeof item.projectData.technology === "string" &&
            item.projectData.technology.toLowerCase().includes(query)) ||
          (Array.isArray(item.projectData.technology) &&
            item.projectData.technology[0] &&
            item.projectData.technology[0].toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        filteredData.sort((a, b) => (b.projectData.id || 0) - (a.projectData.id || 0));
        break;
      case SORT_OPTIONS.OLDEST:
        filteredData.sort((a, b) => (a.projectData.id || 0) - (b.projectData.id || 0));
        break;
      case SORT_OPTIONS.NAME_ASC:
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SORT_OPTIONS.NAME_DESC:
        filteredData.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setDisplayedItems(filteredData);
  }, [searchQuery, sortBy, selectedCategory, galleryData]);

  useEffect(() => {
    filterAndSortData();
  }, [filterAndSortData]);

  useEffect(() => {
    setConfettiStart(true);
    const timer = setTimeout(() => setConfettiStart(false), CONFETTI_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = image => {
    setSelectedImageForLightbox(image);
  };

  const uniqueCategories = Array.from(new Set(galleryData.map(item => item.projectData.category)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }, // Faster stagger for gallery
  };

  // Loading skeleton can be simpler if GalleryGrid handles its own items
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[4/3] bg-[var(--background-elevated)] rounded-lg"></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      <style>{fontStyles}</style>
      {confettiStart && <ReactConfetti recycle={false} duration={CONFETTI_DURATION} />}

      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage />
      </div>

      <main className="flex-grow bg-[var(--background-default)] pt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar for Categories */}
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="sticky top-24 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md border border-[var(--border-color)] p-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center">
                  <FaTags className="mr-2" /> Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                      selectedCategory === null
                        ? "bg-[var(--primary-main)] text-white"
                        : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                    }`}
                  >
                    All Projects
                  </button>
                  {uniqueCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                        selectedCategory === category
                          ? "bg-[var(--primary-main)] text-white"
                          : "text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area for Gallery */}
            <div className="flex-1">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                  <Tooltip text="Search by title, category, or technology">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search gallery..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                    </div>
                  </Tooltip>
                </div>

                {/* Sort Options */}
                <Tooltip text="Sort items">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="appearance-none bg-[var(--background-paper)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <option value={SORT_OPTIONS.NEWEST}>Newest</option>
                      <option value={SORT_OPTIONS.OLDEST}>Oldest</option>
                      <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
                      <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
                      <FaSort className="fill-current h-4 w-4" />
                    </div>
                  </div>
                </Tooltip>

                {/* View Mode (Simplified for now, assuming GalleryGrid handles its layout) */}
                {/* You can expand this if GalleryGrid takes specific column props */}
                <Tooltip text="Toggle View (Feature may depend on GalleryGrid capabilities)">
                  <button
                    onClick={() => setViewMode(VIEW_MODES.GRID_AUTO)} // Example, adapt if GalleryGrid has view modes
                    className={`px-4 py-2 rounded-md bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--background-elevated)] shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    <FaThLarge />
                  </button>
                </Tooltip>
              </div>

              {/* Instructions Section (Optional - can be removed or kept) */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Welcome to the Gallery!
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Explore projects, hover for quick details, and click to see more or visit live
                  sites. Use the filters and search to navigate.
                </p>
              </div>

              {isLoading ? (
                <LoadingSkeleton />
              ) : displayedItems.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <GalleryGrid
                    images={displayedItems}
                    onImageClick={handleImageClick}
                    // Pass viewMode or other props if GalleryGrid supports them
                    // e.g., className={viewMode === VIEW_MODES.LIST ? "list-view-class" : "grid-view-class"}
                  />
                </motion.div>
              ) : (
                <motion.p
                  className="text-center text-xl text-[var(--text-secondary)] mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No gallery items found matching your criteria.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedImageForLightbox && (
        <Lightbox
          image={selectedImageForLightbox}
          onClose={() => setSelectedImageForLightbox(null)}
        />
      )}
      <Footer />
    </div>
  );
};

export default GalleryPage;
