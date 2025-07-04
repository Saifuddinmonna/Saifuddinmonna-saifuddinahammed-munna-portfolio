// =======================
// React & Library Imports
// =======================
import React, { useEffect, useState, useContext } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useParams } from "react-router-dom";

// =======================
// Contexts
// =======================
import { ThemeContext } from "../../../App";

// =======================
// Styles
// =======================
import "./Portfolio.css";

// =======================
// Components
// =======================
import NavbarPage2 from "../../layout/NavbarPage/NavbarPage";
import { CategorySidebar, SearchAndFilters, LoadingSkeleton, PortfolioCard } from "./components";

// =======================
// API Services
// =======================
import { getAllPortfolioProjects, getAllCategories } from "../../../services/apiService";

// =======================
// Utils & Constants
// =======================
import {
  CONFETTI_DURATION,
  SORT_OPTIONS,
  STYLE_OPTIONS,
  VIEW_MODES,
  fontStyles,
  buttonVariants,
  commonButtonStyles,
  getStyleClasses,
} from "./utils";

// =======================
// Main PortfolioLayout Component
// =======================
const PortfolioLayout = () => {
  // ===== Context and Hooks =====
  const { isDarkMode } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const { UsedPhone: nameFilter } = useParams();

  // ===== State Management =====
  const [confettiStart, setConfettiStart] = useState(true);
  const [datasServer, setDatasServer] = useState();
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID_3);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentStyle, setCurrentStyle] = useState(STYLE_OPTIONS.DEFAULT);

  // ===== Fetch categories =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setAllCategories(response.data);
        console.log(
          "response from the data fetching for all categories in profileLayout page ",
          response.data
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAllCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // ===== Fetch portfolio data =====
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await getAllPortfolioProjects(params);
        setDatasServer(response.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setDatasServer([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolioData();
  }, [selectedCategory]);

  // ===== Confetti animation control =====
  useEffect(() => {
    setConfettiStart(true);
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, CONFETTI_DURATION);
    return () => clearTimeout(timer);
  }, [datasServer]);

  // ===== Animation variants for cards and containers =====
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

  // =======================
  // Render
  // =======================
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      <style>{fontStyles}</style>
      {confettiStart && <ReactConfetti />}

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">{/* <NavbarPage2 /> */}</div>

      <main className="flex-grow bg-[var(--background-default)] pt-20">
        <div className="container mx-auto px-4 py-4">
          {/* Left Side Categories Menu */}
          <div className="flex flex-col md:flex-row gap-6">
            <CategorySidebar
              allCategories={allCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search and Filter Bar */}
              <SearchAndFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                currentStyle={currentStyle}
                setCurrentStyle={setCurrentStyle}
                viewMode={viewMode}
                setViewMode={setViewMode}
                SORT_OPTIONS={SORT_OPTIONS}
                STYLE_OPTIONS={STYLE_OPTIONS}
                VIEW_MODES={VIEW_MODES}
                buttonVariants={buttonVariants}
                commonButtonStyles={commonButtonStyles}
              />

              {/* Portfolio Grid/List */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : Array.isArray(datasServer) && datasServer.length > 0 ? (
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
                  {(datasServer || []).map(project => {
                    const styleClasses = getStyleClasses(currentStyle);

                    return (
                      <PortfolioCard
                        key={project.name}
                        project={project}
                        viewMode={viewMode}
                        currentStyle={currentStyle}
                        styleClasses={styleClasses}
                        isDarkMode={isDarkMode}
                        showMore={showMore}
                        setShowMore={setShowMore}
                        commonButtonStyles={commonButtonStyles}
                        buttonVariants={buttonVariants}
                        cardVariants={cardVariants}
                        VIEW_MODES={VIEW_MODES}
                      />
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

// =======================
// Export
// =======================
export default PortfolioLayout;
