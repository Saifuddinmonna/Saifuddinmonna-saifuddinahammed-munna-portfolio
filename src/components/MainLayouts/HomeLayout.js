import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import HomePageHero from "../CommonComponents/HomePageHero";
import SkillDetails from "../CommonComponents/SkillProgressbar";
import SkillChart from "../CommonComponents/SkillChart";
import MyPortfolios from "../MyPortfolios/MyPortfoliosForHomePage";
import MyServicesv2 from "../Myservices/MyServicesv2";
import HomeLayoutComponents from "../HomePageComponents/HomeLayoutComponents";
import ContactMeForHomePage from "../ContractMe/ContactMeForHomePage";

/**
 * HomeLayout Component
 * Main layout component for the home page
 * Includes hero section, skills, portfolio, services, and contact sections
 */
const HomeLayout = () => {
  // State for confetti animation and back-to-top button
  const [confettiStart, setConfettiStart] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize page and set up scroll behavior
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "smooth";

    // Handle scroll event for back-to-top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop confetti animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Scroll to top of the page smoothly
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-default)]">
      {/* Confetti animation on initial load */}
      {confettiStart && <ReactConfetti />}

      {/* Main content sections */}
      <div className="space-y-16 md:space-y-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HomePageHero />
        </motion.div>

        {/* Professional Profile Section */}
        <HomeLayoutComponents />

        {/* Skills Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SkillChart />
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <MyServicesv2 />
        </motion.div>

        {/* Skills Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SkillDetails />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <MyPortfolios />
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ContactMeForHomePage />
        </motion.div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[var(--primary-main)] text-white p-2.5 rounded-full shadow-lg hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:ring-opacity-50 transition-colors duration-300"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default HomeLayout;
