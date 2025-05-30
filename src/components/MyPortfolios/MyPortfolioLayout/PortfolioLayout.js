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
    <div className="animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="m-5 p-6 bg-gray-200 dark:bg-gray-700 rounded-xl">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <style>{fontStyles}</style>
      {confettiStart && <ReactConfetti />}

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>

      <main className="flex-grow bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-['Inter'] text-base"
                />
                <FaSearch className="absolute left-2  color-green-400 top-3  text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-['Inter'] text-base"
              >
                <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
                <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
                <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
                <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {viewMode === "grid" ? <FaList /> : <FaThLarge />}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="space-y-2">
                  <motion.div
                    className="progress-bar h-1 bg-indigo-500 dark:bg-indigo-400 z-[99998] absolute mx-3 rounded-xl bottom-0"
                    style={{ scaleX: scrollYProgress }}
                  />

                  {/* Category Buttons */}
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => setSelectedCategory(null)}
                      className={`group relative w-full text-left px-4 py-2 rounded-lg overflow-hidden font-['Poppins'] text-sm ${
                        selectedCategory === null
                          ? "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center">
                        <FaLayerGroup className="w-4 h-4 mr-1.5 text-inherit" />
                        All Projects
                      </span>
                    </motion.button>
                    {Array.from(new Set(portfoliosName.map(p => p.category))).map(
                      (category, index) => {
                        let Icon;
                        switch (category.toLowerCase()) {
                          case "e-commerce website":
                            Icon = FaShoppingCart;
                            break;
                          case "service selling project":
                            Icon = FaBriefcase;
                            break;
                          case "educational project":
                            Icon = FaGraduationCap;
                            break;
                          case "quiz app project":
                            Icon = FaQuestionCircle;
                            break;
                          case "portfolio website project":
                            Icon = FaCode;
                            break;
                          case "to-do app":
                            Icon = FaClipboardList;
                            break;
                          case "our app":
                            Icon = FaMobileAlt;
                            break;
                          case "cost calculation websites":
                            Icon = FaCalculator;
                            break;
                          case "news portal project":
                            Icon = FaNewspaper;
                            break;
                          default:
                            Icon = FaCode; // Default icon
                        }

                        return (
                          <motion.button
                            key={index}
                            onClick={() => setSelectedCategory(category)}
                            className={`group relative w-full text-left px-4 py-2 rounded-lg overflow-hidden font-['Poppins'] text-sm ${
                              selectedCategory === category
                                ? "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10 flex items-center">
                              <Icon className="w-4 h-4 mr-1.5 text-inherit" />
                              {category}
                            </span>
                          </motion.button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <AnimatePresence>
                  <motion.div
                    className={`space-y-6 ${
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""
                    }`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {datas?.map((portfolio, index) => (
                      <motion.div
                        key={portfolio.id}
                        className={`${
                          viewMode === "grid"
                            ? ""
                            : "pl-3 m-5 border shadow-lg rounded-xl mx-auto overflow-hidden"
                        } bg-white dark:bg-gray-800 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-xl`}
                        variants={cardVariants}
                        layout
                      >
                        {/* Portfolio Content */}
                        <div className="p-6">
                          <motion.h2
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-['Playfair_Display']"
                            variants={titleVariants}
                          >
                            {portfolio.name}
                            <span className="block text-sm font-normal text-indigo-600 dark:text-indigo-400 font-['Inter']">
                              {portfolio.category}
                            </span>
                          </motion.h2>

                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {portfolio.technology.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full font-['Inter']"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Project Links */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {portfolio.liveWebsite && (
                              <motion.a
                                href={portfolio.liveWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="group no-underline relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-lg overflow-hidden font-['Poppins'] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <FaExternalLinkAlt className="text-lg relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Live Website</span>
                              </motion.a>
                            )}
                            {portfolio.liveWebsiteRepo && (
                              <motion.a
                                href={portfolio.liveWebsiteRepo}
                                target="_blank"
                                rel="noreferrer"
                                className="group no-underline relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-lg overflow-hidden font-['Poppins'] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <FaGithub className="text-lg relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Client Code</span>
                              </motion.a>
                            )}
                            {portfolio.liveServersite && (
                              <motion.a
                                href={portfolio.liveServersite}
                                target="_blank"
                                rel="noreferrer"
                                className="group no-underline relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg overflow-hidden font-['Poppins'] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <FaServer className="text-lg relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Live Server</span>
                              </motion.a>
                            )}
                            {portfolio.liveServersiteRepo && (
                              <motion.a
                                href={portfolio.liveServersiteRepo}
                                target="_blank"
                                rel="noreferrer"
                                className="group no-underline relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-lg overflow-hidden font-['Poppins'] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <FaServer className="text-lg relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Server Code</span>
                              </motion.a>
                            )}
                          </div>

                          {/* Overview */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-['Playfair_Display']">
                              Overview
                            </h3>
                            <PortfolioOverview
                              overview={portfolio.overview}
                              showMore={showMore}
                              setShowMore={setShowMore}
                            />
                          </div>
                          {/* Project Images */}
                          <div
                            className={`grid ${
                              viewMode === "grid" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
                            } gap-4`}
                          >
                            {portfolio?.image?.map((img, imgIndex) => (
                              <PortfolioImage key={imgIndex} img={img} index={imgIndex} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Portfolio Overview Component
const PortfolioOverview = ({ overview, showMore, setShowMore }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {showMore
        ? overview.map((item, index) => (
            <motion.p
              key={index}
              className="text-gray-700 dark:text-gray-300 font-['Inter'] text-sm italic leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              {item}
            </motion.p>
          ))
        : overview.slice(0, 2).map((item, index) => (
            <motion.p
              key={index}
              className="text-gray-700 dark:text-gray-300 font-['Inter'] text-sm italic leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              {item}
            </motion.p>
          ))}
    </motion.div>
    {overview.length > 2 && (
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          className="group flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-['Poppins'] font-medium text-sm bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300"
          onClick={() => setShowMore(!showMore)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{showMore ? "Show less" : "Show more"}</span>
          <motion.svg
            className="w-4 h-4 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: showMore ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </motion.div>
    )}
  </motion.div>
);

// Portfolio Image Component
const PortfolioImage = ({ img, index }) => (
  <motion.div
    className="relative group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <PhotoProvider>
      <PhotoView src={`images/${img}`}>
        <div className="relative overflow-hidden aspect-video">
          <img
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            src={`images/${img}`}
            alt="Portfolio screenshot"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </PhotoView>
    </PhotoProvider>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500 dark:group-hover:border-indigo-400 transition-colors duration-300 rounded-xl pointer-events-none" />
  </motion.div>
);

export default PortfolioLayout;
