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
import { motion, useScroll, useSpring } from "framer-motion";
import portfoliosName from "../portfolios.json";
import "./Portfolio.css";
import NavbarPage2 from "../../NavbarPage/NavbarPage";
import Footer from "../../BodyDiv/Footer";

// Constants
const CONFETTI_DURATION = 8000;
const MOBILE_BREAKPOINT = 720;
const SCROLL_POSITION = {
  mobile: 800,
  desktop: 0,
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

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch("portfolios.json");
        const data = await response.json();
        setDatas(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setDatas(portfoliosName); // Fallback to imported data
      }
    };
    fetchPortfolioData();
  }, []);

  // Filter portfolio data based on category
  const filterPortfolioData = useCallback(
    async category => {
      const filteredData = portfoliosName.filter(data => data.name === (category || nameFilter));
      setDatas(filteredData);

      // Scroll to appropriate position based on screen size
      const scrollPosition =
        window.screen.availWidth < MOBILE_BREAKPOINT
          ? SCROLL_POSITION.mobile
          : SCROLL_POSITION.desktop;
      window.scrollTo(0, scrollPosition);
    },
    [nameFilter]
  );

  // Reset portfolio data to show all items
  const resetPortfolioData = useCallback(async () => {
    setDatas(portfoliosName);
  }, []);

  // Handle category filter
  useEffect(() => {
    filterPortfolioData();
  }, [nameFilter, filterPortfolioData]);

  // Confetti animation control
  useEffect(() => {
    setConfettiStart(true);
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, CONFETTI_DURATION);
    return () => clearTimeout(timer);
  }, [datas]);

  // Animation variants for motion components
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.2 + index * 0.1 },
    }),
  };

  // Button hover animations
  const buttonHoverAnimation = {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
  };

  const linkHoverAnimation = {
    scale: 1.1,
    x: 5,
    rotate: -2,
    boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.5)",
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {confettiStart && <ReactConfetti />}

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>

      <main className="flex-grow bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
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
                  {portfoliosName?.map((category, index) => (
                    <div key={index}>
                      <motion.button
                        onClick={() => filterPortfolioData(category.name)}
                        className="flex flex-wrap text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-400 font-medium rounded-xl text-sm block w-full m-2 p-2"
                        whileHover={buttonHoverAnimation}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {category.category}
                      </motion.button>
                    </div>
                  ))}

                  {/* Reset Button */}
                  <motion.button
                    onClick={resetPortfolioData}
                    className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-400 font-medium rounded-xl text-sm block w-full m-2 p-2"
                    whileHover={buttonHoverAnimation}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    All
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="space-y-6">
                {datas?.map((portfolio, index) => (
                  <motion.div
                    key={index}
                    className="pl-3 m-5 border shadow-lg rounded-xl mx-auto overflow-hidden bg-white dark:bg-gray-800 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-xl"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    {/* Portfolio Header */}
                    <motion.h1
                      className="mt-3 text-3xl font-semibold text-center text-gray-800 dark:text-white capitalize lg:text-4xl"
                      variants={titleVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <motion.span
                        className="p-2 px-3 border shadow-lg bg-indigo-500 dark:bg-indigo-600 text-white rounded-full"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0px 0px 15px rgba(99, 102, 241, 0.8)",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {datas.length}
                      </motion.span>{" "}
                      {datas.length > 1 ? " Websites Are" : "Website Is"}
                      <motion.span
                        className="text-indigo-600 dark:text-indigo-300"
                        whileHover={{ color: "#EC4899" }}
                        transition={{ duration: 0.2 }}
                      >
                        {" "}
                        Founded {datas.length === 14 ? "Here " : "in This Category"}
                      </motion.span>
                    </motion.h1>

                    {/* Portfolio Content */}
                    <section className="text-gray-600 dark:text-gray-200 body-font">
                      <div className="container p-3 m-3 mx-auto">
                        {/* Portfolio Title */}
                        <motion.h1
                          className="text-3xl font-semibold text-center text-gray-800 dark:text-white capitalize lg:text-4xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                          {portfolio.category} :{" "}
                          <motion.span
                            className="text-indigo-600 dark:text-indigo-300"
                            whileHover={{ letterSpacing: "0.5px", color: "#EC4899" }}
                            transition={{ duration: 0.2 }}
                          >
                            {portfolio.name}
                          </motion.span>
                        </motion.h1>

                        {/* Portfolio Details Grid */}
                        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
                          {/* Links Section */}
                          <div className="p-4 sm:1 md:w-1/2 lg:w-1/3 md:flex">
                            <div className="flex-grow pl-6">
                              <h2 className="text-gray-900 dark:text-white text-left text-2xl text-strong title-font font-medium mb-2">
                                Website Link
                              </h2>
                              {/* Portfolio Links */}
                              <PortfolioLinks
                                portfolio={portfolio}
                                linkHoverAnimation={linkHoverAnimation}
                              />
                            </div>
                          </div>

                          {/* Technologies Section */}
                          <div className="p-4 md:w-1/3 flex">
                            <div className="flex-grow pl-6">
                              <motion.h2
                                className="text-white bg-indigo-600 dark:bg-indigo-500 p-2 rounded text-2xl font-medium mb-2"
                                whileHover={{
                                  letterSpacing: "0.2px",
                                  boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                Used Technologies
                              </motion.h2>
                              <p className="leading-relaxed text-base text-gray-700 dark:text-gray-200">
                                {portfolio.technology}
                              </p>
                            </div>
                          </div>

                          {/* Overview Section */}
                          <div className="p-4 md:w-1/3 flex">
                            <div className="flex-grow pl-6">
                              <motion.h2
                                className="text-white bg-indigo-600 dark:bg-indigo-500 p-2 rounded text-2xl font-medium mb-2"
                                whileHover={{
                                  letterSpacing: "0.2px",
                                  boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                Overview
                              </motion.h2>
                              <PortfolioOverview
                                overview={portfolio.overview}
                                showMore={showMore}
                                setShowMore={setShowMore}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Portfolio Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                      {portfolio?.image?.map((img, imgIndex) => (
                        <PortfolioImage key={imgIndex} img={img} index={imgIndex} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Portfolio Links Component
const PortfolioLinks = ({ portfolio, linkHoverAnimation }) => (
  <>
    <motion.p
      className="text-left mt-2 btn btn-sm block uppercase tracking-wider font-bold text-sm text-white bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-md hover:shadow-lg"
      whileHover={linkHoverAnimation}
      whileTap={{ scale: 0.9, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <a
        className="text-decoration-none block"
        target="_blank"
        href={portfolio.liveWebsite}
        rel="noreferrer"
      >
        Live Website Link
      </a>
    </motion.p>
    {/* Add other links similarly */}
  </>
);

// Portfolio Overview Component
const PortfolioOverview = ({ overview, showMore, setShowMore }) => (
  <>
    {showMore
      ? overview.map((item, index) => (
          <p key={index} className="text-left text-gray-700 dark:text-gray-200">
            {item}
          </p>
        ))
      : overview.slice(0, 2).map((item, index) => (
          <p key={index} className="text-left text-gray-700 dark:text-gray-200">
            {item}
          </p>
        ))}
    {overview.length > 2 && (
      <button
        className="btn btn-xs flex items-center text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 mt-2"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more"}
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          className="w-4 h-4 ml-2 d-inline-block"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </>
);

// Portfolio Image Component
const PortfolioImage = ({ img, index }) => (
  <motion.div
    className="m-2 p-1 rounded-xl bg-white dark:bg-gray-800"
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{
      scale: 1.08,
      y: -5,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
    }}
  >
    <PhotoProvider>
      <PhotoView src={`images/${img}`}>
        <img className="rounded-xl maxHight" src={`images/${img}`} alt="Portfolio screenshot" />
      </PhotoView>
    </PhotoProvider>
  </motion.div>
);

export default PortfolioLayout;
