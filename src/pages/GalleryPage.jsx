import React, { useEffect, useState, useContext, useCallback } from "react";
import ReactConfetti from "react-confetti";
import GalleryGrid from "../components/Gallery/GalleryGrid";
import Lightbox from "../components/Gallery/Lightbox";
import portfoliosData from "../components/MyPortfolios/portfolios.json";
import NavbarPage from "../components/layout/NavbarPage/NavbarPage";
import Footer from "../components/layout/Footer";
import { ThemeContext } from "../App";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FaSearch, FaThLarge, FaList, FaSort, FaPalette, FaTags } from "react-icons/fa";

// Add Google Fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
`;

// Constants
const CONFETTI_DURATION = 5000;
const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
};

const VIEW_MODES = {
  GRID_1: "grid-1",
  GRID_2: "grid-2",
  GRID_3: "grid-3",
  LIST: "list",
};

// Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] text-sm rounded-md shadow-lg border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--background-elevated)]"></div>
    </div>
  </div>
);

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const GalleryPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  const [confettiStart, setConfettiStart] = useState(true);
  const [galleryData, setGalleryData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID_3);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Prepare gallery data
  useEffect(() => {
    setIsLoading(true);
    const data = portfoliosData
      .flatMap((project, projectIndex) =>
        project.image.map(img => ({
          src: `/images/${img}`,
          alt: `${project.name} - ${img}`,
          title: project.name,
          description: project.category,
          projectData: {
            name: project.name,
            id: project.id || `proj-${projectIndex}`,
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
      .sort((a, b) => (b.projectData.id || 0) - (a.projectData.id || 0));
    setGalleryData(data);
    setIsLoading(false);
  }, []);

  // Filter and sort data
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
    setSelectedImage(image);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const uniqueCategories = Array.from(new Set(galleryData.map(item => item.projectData.category)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

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

      {/* Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-40"
        style={{
          scaleX,
          transformOrigin: "0%",
          top: "3.5rem",
        }}
      />

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

            {/* Main Content */}
            <div className="flex-1">
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[var(--background-paper)]/50 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-color)] p-6 mb-6"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-[var(--text-primary)]"
                >
                  Project{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
                    Gallery
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto"
                >
                  Explore my portfolio of web development projects. Click on any image to view
                  details and access live demos.
                </motion.p>

                {/* Controls Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[var(--background-elevated)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent text-[var(--text-primary)]"
                    />
                  </div>

                  {/* View Mode Controls */}
                  <div className="flex items-center gap-2">
                    <Tooltip text="Grid 1 Column">
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setViewMode(VIEW_MODES.GRID_1)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          viewMode === VIEW_MODES.GRID_1
                            ? "bg-[var(--primary-main)] text-white"
                            : "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]"
                        }`}
                      >
                        <div className="w-4 h-4 grid grid-cols-1 gap-0.5">
                          <div className="w-full h-full bg-current rounded-sm"></div>
                        </div>
                      </motion.button>
                    </Tooltip>

                    <Tooltip text="Grid 2 Columns">
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setViewMode(VIEW_MODES.GRID_2)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          viewMode === VIEW_MODES.GRID_2
                            ? "bg-[var(--primary-main)] text-white"
                            : "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]"
                        }`}
                      >
                        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                          <div className="w-full h-full bg-current rounded-sm"></div>
                          <div className="w-full h-full bg-current rounded-sm"></div>
                        </div>
                      </motion.button>
                    </Tooltip>

                    <Tooltip text="Grid 3+ Columns">
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setViewMode(VIEW_MODES.GRID_3)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          viewMode === VIEW_MODES.GRID_3
                            ? "bg-[var(--primary-main)] text-white"
                            : "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]"
                        }`}
                      >
                        <FaThLarge />
                      </motion.button>
                    </Tooltip>

                    <Tooltip text="List View">
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setViewMode(VIEW_MODES.LIST)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          viewMode === VIEW_MODES.LIST
                            ? "bg-[var(--primary-main)] text-white"
                            : "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]"
                        }`}
                      >
                        <FaList />
                      </motion.button>
                    </Tooltip>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                      <Tooltip text="Sort Options">
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="p-2 rounded-lg bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)] transition-all duration-300"
                        >
                          <FaSort />
                        </motion.button>
                      </Tooltip>
                      <div className="absolute right-0 top-full mt-1 bg-[var(--background-elevated)] border border-[var(--border-color)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 min-w-[150px]">
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="w-full bg-transparent border-none px-3 py-2 text-[var(--text-primary)] focus:outline-none cursor-pointer"
                        >
                          <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
                          <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
                          <option value={SORT_OPTIONS.NAME_ASC}>Name A-Z</option>
                          <option value={SORT_OPTIONS.NAME_DESC}>Name Z-A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-center text-[var(--text-secondary)] text-sm">
                  Showing {displayedItems.length} of {galleryData.length} projects
                </div>
              </motion.div>

              {/* Gallery Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-[var(--background-paper)]/50 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-color)] p-6"
              >
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <GalleryGrid images={displayedItems} viewMode={viewMode} />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {selectedImage && <Lightbox image={selectedImage} onClose={handleCloseLightbox} />}

      <Footer />
    </div>
  );
};

export default GalleryPage;
