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
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-[var(--background-paper)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent"
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

                {/* View Mode Buttons */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-l-md border border-[var(--border-color)] ${
                      viewMode === "grid"
                        ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                        : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                    } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200`}
                    aria-label="Grid view"
                  >
                    <FaThLarge />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-r-md border border-[var(--border-color)] ${
                      viewMode === "list"
                        ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                        : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
                    } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200`}
                    aria-label="List view"
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              {/* Portfolio Grid/List */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : datas.length > 0 ? (
                <motion.div
                  className={`grid gap-6 md:gap-8 lg:gap-10 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {datas.map(project => (
                    <motion.div
                      key={project.name}
                      className={`bg-[var(--background-paper)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-[var(--border-color)] ${
                        viewMode === "list" ? "flex flex-col md:flex-row" : ""
                      }`}
                      variants={cardVariants}
                      whileHover={{
                        y: viewMode === "grid" ? -5 : 0,
                        boxShadow: isDarkMode
                          ? "0 10px 15px -3px rgba(0 0 0 / 0.4)"
                          : "0 10px 15px -3px rgba(0 0 0 / 0.1)",
                      }}
                    >
                      <div
                        className={`${
                          viewMode === "list" ? "md:w-1/3 lg:w-1/4" : "aspect-video"
                        } relative overflow-hidden`}
                      >
                        <PhotoProvider>
                          <PhotoView src={`/images/${project.image[0]}`}>
                            <motion.img
                              src={`/images/${project.image[0]}`}
                              alt={project.name}
                              className="w-full h-full object-cover transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </PhotoView>
                        </PhotoProvider>
                        {viewMode === "grid" && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </div>
                      <div className={`p-5 md:p-6 lg:p-7 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-3">
                          {project.name}
                        </h3>
                        <p className="text-sm md:text-base text-[var(--primary-main)] mb-3">
                          {project.category}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm md:text-base line-clamp-3 mb-4">
                          {project.overview[0]}
                        </p>
                        {viewMode === "list" && (
                          <PortfolioOverview
                            overview={project.overview}
                            showMore={showMore}
                            setShowMore={setShowMore}
                          />
                        )}

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          {project.liveWebsite && (
                            <motion.a
                              href={project.liveWebsite}
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
                          {project.liveWebsiteRepo && (
                            <motion.a
                              href={project.liveWebsiteRepo}
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
                          {project.liveServersite && (
                            <motion.a
                              href={project.liveServersite}
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
                          {project.liveServersiteRepo && (
                            <motion.a
                              href={project.liveServersiteRepo}
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
                        {viewMode === "grid" && (
                          <div className="mt-4">
                            {/* Render only a few technologies for grid view */}
                            <div className="flex flex-wrap gap-2">
                              {project.technology.slice(0, 4).map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-[var(--background-elevated)] text-[var(--text-secondary)] text-xs rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technology.length > 4 && (
                                <span className="px-2 py-1 bg-[var(--background-elevated)] text-[var(--text-secondary)] text-xs rounded-md">
                                  + {project.technology.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
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
