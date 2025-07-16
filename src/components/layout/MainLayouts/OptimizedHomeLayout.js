import React, { useState, useEffect, lazy, Suspense } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import IntersectionLoader from "../../features/IntersectionLoader";

// Lazy load all components for better performance
const HomePageHero = lazy(() => import("../../CommonComponents/HomePageHero"));
const SkillDetails = lazy(() => import("../../CommonComponents/SkillProgressbar"));
const SkillChart = lazy(() => import("../../CommonComponents/SkillChart"));
const MyPortfolios = lazy(() => import("../../MyPortfolios/MyPortfoliosForHomePage"));
const MyServicesv2 = lazy(() => import("../../Myservices/MyServicesv2"));
const HomeLayoutComponents = lazy(() => import("../../HomePageComponents/HomeLayoutComponents"));
const ContactMeForHomePage = lazy(() => import("../../ContractMe/ContactMeForHomePage"));

// Loading skeleton components
const HeroSkeleton = () => (
  <div className="w-full h-96 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl animate-pulse">
    <div className="flex items-center justify-around flex-col lg:flex-row-reverse gap-8 lg:gap-12 p-8">
      <div className="w-64 h-64 md:w-96 md:h-96 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-56"></div>
      </div>
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
    <div className="p-8 space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
    </div>
  </div>
);

/**
 * Animation variants for section transitions
 */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Optimized HomeLayout Component
 * Features progressive loading and lazy loading for better performance
 */
const OptimizedHomeLayout = () => {
  const [confettiStart, setConfettiStart] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize page
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Confetti animation */}
      {confettiStart && <ReactConfetti />}

      {/* Main content sections with progressive loading */}
      <div className="space-y-16 md:space-y-24 py-8">
        {/* Hero Section - Load immediately */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <Suspense fallback={<HeroSkeleton />}>
            <HomePageHero />
          </Suspense>
        </motion.div>

        {/* Professional Profile Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={200}>
          <Suspense fallback={<SectionSkeleton />}>
            <HomeLayoutComponents />
          </Suspense>
        </IntersectionLoader>

        {/* Skills Chart Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={300}>
          <Suspense fallback={<SectionSkeleton />}>
            <SkillChart />
          </Suspense>
        </IntersectionLoader>

        {/* Services Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={400}>
          <Suspense fallback={<SectionSkeleton />}>
            <MyServicesv2 />
          </Suspense>
        </IntersectionLoader>

        {/* Skills Details Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={500}>
          <Suspense fallback={<SectionSkeleton />}>
            <SkillDetails />
          </Suspense>
        </IntersectionLoader>

        {/* Portfolio Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={600}>
          <Suspense fallback={<SectionSkeleton />}>
            <MyPortfolios />
          </Suspense>
        </IntersectionLoader>

        {/* Contact Section */}
        <IntersectionLoader fallback={<SectionSkeleton />} delay={700}>
          <Suspense fallback={<SectionSkeleton />}>
            <ContactMeForHomePage />
          </Suspense>
        </IntersectionLoader>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[var(--primary-main)] text-white p-2.5 rounded-full shadow-lg hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:ring-opacity-50 transition-colors duration-300 z-50"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
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

export default OptimizedHomeLayout;
