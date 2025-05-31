/**
 * PortfolioLayout Component
 *
 * Comment Index:
 * 1. Constants Section (Lines 15-20)
 *    - CONFETTI_DURATION
 *    - MOBILE_BREAKPOINT
 *    - SCROLL_POSITION
 *
 * 2. Context and Hooks Section (Lines 23-27)
 *    - ThemeContext
 *    - Scroll Progress
 *    - URL Parameters
 *
 * 3. State Management Section (Lines 29-32)
 *    - Confetti State
 *    - Portfolio Data State
 *    - Show More State
 *
 * 4. Data Fetching Section (Lines 34-45)
 *    - Portfolio Data Fetch
 *    - Error Handling
 *
 * 5. Filter Functions Section (Lines 47-66)
 *    - Portfolio Filter
 *    - Reset Function
 *
 * 6. Effect Hooks Section (Lines 68-80)
 *    - Category Filter Effect
 *    - Confetti Animation Effect
 *
 * 7. Animation Variants Section (Lines 82-97)
 *    - Card Animations
 *    - Title Animations
 *
 * 8. Hover Animations Section (Lines 99-110)
 *    - Button Hover Effects
 *    - Link Hover Effects
 *
 * 9. Main Component Structure (Lines 112-383)
 *    - Navigation
 *    - Sidebar
 *    - Main Content
 *    - Portfolio Cards
 *
 * 10. Sub-Components Section (Lines 385-450)
 *     - PortfolioLinks
 *     - PortfolioOverview
 *     - PortfolioImage
 */

import React, { useEffect, useState, useContext, useCallback } from "react";
import ReactConfetti from "react-confetti";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../../App";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import portfoliosName from "../portfolios.json";
import "./Portfolio.css";
import NavbarPage2 from "../../NavbarPage/NavbarPage";
import Footer from "../../CommonComponents/Footer";
import {
  FaSearch,
  FaThLarge,
  FaList,
  FaSort,
  FaGithub,
  FaServer,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaShoppingCart,
  FaBriefcase,
  FaGraduationCap,
  FaQuestionCircle,
  FaCode,
  FaClipboardList,
  FaMobileAlt,
  FaCalculator,
  FaNewspaper,
  FaPalette,
} from "react-icons/fa";

// Add Google Fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
`;

// Constants
const CONFETTI_DURATION = 8000;
const MOBILE_BREAKPOINT = 720;
const SCROLL_POSITION = {
  mobile: 800,
  desktop: 0,
};

const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
};

const STYLE_OPTIONS = {
  DEFAULT: "default",
  MODERN: "modern",
  MINIMAL: "minimal",
  GRADIENT: "gradient",
  NEUMORPHIC: "neumorphic",
};

const VIEW_MODES = {
  GRID_1: "grid-1",
  GRID_2: "grid-2",
  GRID_3: "grid-3",
  LIST: "list",
};

// Add Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] text-sm rounded-md shadow-lg border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--background-elevated)]"></div>
    </div>
  </div>
);

// Add animation variants for buttons
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

// Common button styles
const commonButtonStyles =
  "transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] active:translate-y-[1px] shadow-md hover:shadow-lg";

const PortfolioLayout = () => {
  // Context and Hooks
  const { isDarkMode } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const { UsedPhone: nameFilter } = useParams();

  // State Management
  const [confettiStart, setConfettiStart] = useState(true);
  const [datas, setDatas] = useState(portfoliosName);
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID_3);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentStyle, setCurrentStyle] = useState(STYLE_OPTIONS.DEFAULT);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("portfolios.json");
        const data = await response.json();
        setDatas(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setDatas(portfoliosName);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  // Filter and sort portfolio data
  const filterAndSortData = useCallback(() => {
    let filteredData = [...portfoliosName];

    // Apply category filter
    if (selectedCategory) {
      filteredData = filteredData.filter(data => data.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        data =>
          data.name.toLowerCase().includes(query) ||
          data.category.toLowerCase().includes(query) ||
          data.technology.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        filteredData.sort((a, b) => b.id - a.id);
        break;
      case SORT_OPTIONS.OLDEST:
        filteredData.sort((a, b) => a.id - b.id);
        break;
      case SORT_OPTIONS.NAME_ASC:
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SORT_OPTIONS.NAME_DESC:
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setDatas(filteredData);
  }, [searchQuery, sortBy, selectedCategory]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortData();
  }, [filterAndSortData]);

  // Confetti animation control
  useEffect(() => {
    setConfettiStart(true);
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, CONFETTI_DURATION);
    return () => clearTimeout(timer);
  }, [datas]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Style variants for different preview modes
  const getStyleClasses = style => {
    switch (style) {
      case STYLE_OPTIONS.MODERN:
        return {
          card: "bg-gradient-to-br from-[var(--background-paper)] to-[var(--background-elevated)] border-none shadow-lg hover:shadow-xl",
          title: "text-[var(--primary-main)] dark:text-[var(--primary-light)]",
          category: "text-[var(--secondary-main)] dark:text-[var(--secondary-light)]",
          description: "text-[var(--text-secondary)]",
          button:
            "bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)]",
        };
      case STYLE_OPTIONS.MINIMAL:
        return {
          card: "bg-[var(--background-paper)] border border-[var(--border-color)] shadow-sm hover:shadow-md",
          title: "text-[var(--text-primary)]",
          category: "text-[var(--text-secondary)]",
          description: "text-[var(--text-secondary)]",
          button:
            "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-paper)]",
        };
      case STYLE_OPTIONS.GRADIENT:
        return {
          card: "bg-gradient-to-r from-[var(--primary-main)]/10 to-[var(--secondary-main)]/10 border border-[var(--border-color)]/50",
          title: "text-[var(--primary-main)] dark:text-[var(--primary-light)]",
          category: "text-[var(--secondary-main)] dark:text-[var(--secondary-light)]",
          description: "text-[var(--text-secondary)]",
          button:
            "bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white",
        };
      case STYLE_OPTIONS.NEUMORPHIC:
        return {
          card: "bg-[var(--background-paper)] shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.1)] border-none",
          title: "text-[var(--text-primary)]",
          category: "text-[var(--text-secondary)]",
          description: "text-[var(--text-secondary)]",
          button: "bg-[var(--background-elevated)] text-[var(--text-primary)] shadow-inner",
        };
      default:
        return {
          card: "bg-[var(--background-paper)] border border-[var(--border-color)]",
          title: "text-[var(--text-primary)]",
          category: "text-[var(--text-secondary)]",
          description: "text-[var(--text-secondary)]",
          button: "bg-[var(--primary-main)] text-white",
        };
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="p-6 bg-[var(--background-paper)] rounded-xl border border-[var(--border-color)] shadow-md"
        >
          <div className="h-8 bg-[var(--background-elevated)] rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-full mb-2"></div>
          <div className="h-4 bg-[var(--background-elevated)] rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      <style>{fontStyles}</style>
      {confettiStart && <ReactConfetti />}

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>

      <main className="flex-grow bg-[var(--background-default)] pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Left Side Categories Menu */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="sticky top-24 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md border border-[var(--border-color)] p-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Categories
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
                  {Array.from(new Set(portfoliosName.map(project => project.category))).map(
                    category => (
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
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Tooltip text="Search projects by name, category, or technology">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent shadow-md hover:shadow-lg transition-all duration-300"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                    </div>
                  </Tooltip>
                </div>

                {/* Sort By Dropdown */}
                <Tooltip text="Sort projects by different criteria">
                  <motion.div
                    className="relative"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className={`appearance-none bg-[var(--background-paper)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent ${commonButtonStyles}`}
                    >
                      <option value={SORT_OPTIONS.NEWEST}>Newest</option>
                      <option value={SORT_OPTIONS.OLDEST}>Oldest</option>
                      <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
                      <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
                      <FaSort className="fill-current h-4 w-4" />
                    </div>
                  </motion.div>
                </Tooltip>

                {/* Style Preview Button */}
                <Tooltip text="Change the visual style of project cards">
                  <motion.div
                    className="relative group"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentStyle(prev => {
                          const styles = Object.values(STYLE_OPTIONS);
                          const currentIndex = styles.indexOf(prev);
                          return styles[(currentIndex + 1) % styles.length];
                        })
                      }
                      className={`px-4 py-2 rounded-md bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--background-elevated)] ${commonButtonStyles}`}
                    >
                      <FaPalette className="h-4 w-4 inline-block mr-2" />
                      <span>Style: {currentStyle}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--background-paper)] rounded-md shadow-lg border border-[var(--border-color)] hidden group-hover:block z-50 transform transition-all duration-300 origin-top-right">
                      {Object.values(STYLE_OPTIONS).map(style => (
                        <motion.button
                          key={style}
                          onClick={() => setCurrentStyle(style)}
                          className={`w-full text-left px-4 py-2 hover:bg-[var(--background-elevated)] ${
                            currentStyle === style
                              ? "bg-[var(--primary-main)] text-white"
                              : "text-[var(--text-primary)]"
                          } ${commonButtonStyles}`}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </Tooltip>

                {/* View Mode Buttons */}
                <Tooltip text="Change the number of cards per row">
                  <motion.div
                    className="flex rounded-md shadow-sm"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode(VIEW_MODES.GRID_1)}
                      className={`px-4 py-2 rounded-l-md border border-[var(--border-color)] ${
                        viewMode === VIEW_MODES.GRID_1
                          ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                          : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
                      aria-label="1 card per row"
                    >
                      <FaThLarge className="transform rotate-45" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode(VIEW_MODES.GRID_2)}
                      className={`px-4 py-2 border-t border-b border-[var(--border-color)] ${
                        viewMode === VIEW_MODES.GRID_2
                          ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                          : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
                      aria-label="2 cards per row"
                    >
                      <div className="flex gap-1">
                        <FaThLarge className="transform rotate-45" />
                        <FaThLarge className="transform rotate-45" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode(VIEW_MODES.GRID_3)}
                      className={`px-4 py-2 border-t border-b border-[var(--border-color)] ${
                        viewMode === VIEW_MODES.GRID_3
                          ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                          : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
                      aria-label="3 cards per row"
                    >
                      <div className="flex gap-1">
                        <FaThLarge className="transform rotate-45" />
                        <FaThLarge className="transform rotate-45" />
                        <FaThLarge className="transform rotate-45" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode(VIEW_MODES.LIST)}
                      className={`px-4 py-2 rounded-r-md border border-[var(--border-color)] ${
                        viewMode === VIEW_MODES.LIST
                          ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                          : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                      } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
                      aria-label="List view"
                    >
                      <FaList />
                    </button>
                  </motion.div>
                </Tooltip>
              </div>

              {/* Portfolio Grid/List */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : datas.length > 0 ? (
                <motion.div
                  className={`grid gap-6 md:gap-8 lg:gap-10 ${
                    viewMode === VIEW_MODES.GRID_1
                      ? "grid-cols-1"
                      : viewMode === VIEW_MODES.GRID_2
                      ? "grid-cols-1 md:grid-cols-2"
                      : viewMode === VIEW_MODES.GRID_3
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {datas.map(project => {
                    const styleClasses = getStyleClasses(currentStyle);
                    return (
                      <motion.div
                        key={project.name}
                        className={`rounded-xl overflow-hidden transition-all duration-300 ${styleClasses.card}`}
                        variants={cardVariants}
                        whileHover={{
                          y:
                            viewMode === VIEW_MODES.GRID_1
                              ? -5
                              : viewMode === VIEW_MODES.GRID_2
                              ? -5
                              : viewMode === VIEW_MODES.GRID_3
                              ? -5
                              : 0,
                          boxShadow: isDarkMode
                            ? "0 10px 15px -3px rgba(0 0 0 / 0.4)"
                            : "0 10px 15px -3px rgba(0 0 0 / 0.1)",
                        }}
                      >
                        <div
                          className={`${
                            viewMode === VIEW_MODES.LIST ? "md:w-1/3 lg:w-1/4" : "aspect-video"
                          } relative overflow-hidden`}
                        >
                          <PhotoProvider>
                            {project.image.map((img, index) => (
                              <PhotoView key={index} src={`/images/${img}`}>
                                {index === 0 && (
                                  <motion.img
                                    src={`/images/${img}`}
                                    alt={`${project.name} image ${index + 1}`}
                                    className="w-full h-full object-cover transition-all duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                )}
                              </PhotoView>
                            ))}
                          </PhotoProvider>
                          {viewMode === VIEW_MODES.GRID_1 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          {viewMode === VIEW_MODES.GRID_2 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          {viewMode === VIEW_MODES.GRID_3 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </div>
                        <div
                          className={`p-5 md:p-6 lg:p-7 ${
                            viewMode === VIEW_MODES.LIST ? "flex-1" : ""
                          }`}
                        >
                          <h3
                            className={`text-xl md:text-2xl font-semibold mb-3 ${styleClasses.title}`}
                          >
                            {project.name}
                          </h3>
                          <p className={`text-sm md:text-base mb-3 ${styleClasses.category}`}>
                            {project.category}
                          </p>
                          <p
                            className={`text-sm md:text-base line-clamp-3 mb-4 ${styleClasses.description}`}
                          >
                            {project.overview[0]}
                          </p>
                          {viewMode === VIEW_MODES.LIST && (
                            <PortfolioOverview
                              overview={project.overview}
                              showMore={showMore}
                              setShowMore={setShowMore}
                            />
                          )}

                          {/* Project Links with Tooltips */}
                          <div className="flex flex-wrap gap-3 mt-4">
                            {project.liveWebsite && (
                              <Tooltip text="Visit the live website">
                                <motion.a
                                  href={project.liveWebsite}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
                                  variants={buttonVariants}
                                  initial="initial"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <FaExternalLinkAlt className="text-sm md:text-base" />
                                  <span>Live</span>
                                </motion.a>
                              </Tooltip>
                            )}
                            {project.liveWebsiteRepo && (
                              <Tooltip text="View the source code on GitHub">
                                <motion.a
                                  href={project.liveWebsiteRepo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
                                  variants={buttonVariants}
                                  initial="initial"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <FaGithub className="text-sm md:text-base" />
                                  <span>Code</span>
                                </motion.a>
                              </Tooltip>
                            )}
                            {project.liveServersite && (
                              <Tooltip text="Visit the server deployment">
                                <motion.a
                                  href={project.liveServersite}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
                                  variants={buttonVariants}
                                  initial="initial"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <FaServer className="text-sm md:text-base" />
                                  <span>Server</span>
                                </motion.a>
                              </Tooltip>
                            )}
                            {project.liveServersiteRepo && (
                              <Tooltip text="View the server code on GitHub">
                                <motion.a
                                  href={project.liveServersiteRepo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
                                  variants={buttonVariants}
                                  initial="initial"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <FaGithub className="text-sm md:text-base" />
                                  <span>Server Code</span>
                                </motion.a>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // No projects found
                <motion.p
                  className="text-center text-xl text-[var(--text-secondary)] mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No projects found matching your criteria.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components (kept for reference, assuming they are defined elsewhere or inline)

const PortfolioLinks = ({ liveWebsite, liveWebsiteRepo, liveServersite, liveServersiteRepo }) => (
  <div className="flex flex-wrap gap-3 mt-4">
    {liveWebsite && (
      <motion.a
        href={liveWebsite}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaExternalLinkAlt className="text-sm md:text-base" />
        <span>Live</span>
      </motion.a>
    )}
    {liveWebsiteRepo && (
      <motion.a
        href={liveWebsiteRepo}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-colors duration-300 border border-[var(--border-color)]"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaGithub className="text-sm md:text-base" />
        <span>Code</span>
      </motion.a>
    )}
    {liveServersite && (
      <motion.a
        href={liveServersite}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-[var(--success-main)] text-white rounded-lg hover:bg-[var(--success-dark)] transition-colors duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaServer className="text-sm md:text-base" />
        <span>Server</span>
      </motion.a>
    )}
    {liveServersiteRepo && (
      <motion.a
        href={liveServersiteRepo}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-colors duration-300 border border-[var(--border-color)]"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaGithub className="text-sm md:text-base" />
        <span>Server Code</span>
      </motion.a>
    )}
  </div>
);

const PortfolioOverview = ({ overview, showMore, setShowMore }) => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Overview</h4>
    {showMore ? (
      <>
        {overview.map((item, index) => (
          <p key={index} className="text-sm text-[var(--text-secondary)] mb-1">
            {item}
          </p>
        ))}
      </>
    ) : (
      <>
        {overview.slice(0, 2).map((item, index) => (
          <p key={index} className="text-sm text-[var(--text-secondary)] mb-1">
            {item}
          </p>
        ))}
      </>
    )}
    {overview.length > 2 && (
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] text-sm mt-2 transition-colors duration-200 focus:outline-none"
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    )}
  </div>
);

const PortfolioImage = ({ img }) => (
  <div className="">
    <div className="border border-[var(--border-color)] m-2 p-2 rounded transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 bg-[var(--background-paper)] duration-300">
      <PhotoProvider>
        <PhotoView src={`images/${img}`}>
          <motion.img
            src={`images/${img}`}
            alt="Portfolio image"
            className="w-full h-auto rounded transition-all duration-300"
          />
        </PhotoView>
      </PhotoProvider>
    </div>
  </div>
);

export default PortfolioLayout;
