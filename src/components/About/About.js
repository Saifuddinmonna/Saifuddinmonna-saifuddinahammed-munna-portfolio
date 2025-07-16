import React, { useState, useEffect, useContext, Suspense, lazy } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";

// Lazy load all components for better performance
const HeroSection = lazy(() => import("./components/HeroSection"));
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const JourneySection = lazy(() => import("./components/JourneySection"));
const SkillsSection = lazy(() => import("./components/SkillsSection"));
const ProjectsSection = lazy(() => import("./components/ProjectsSection"));
const EducationSection = lazy(() => import("./components/EducationSection"));
const VisionSection = lazy(() => import("./components/VisionSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));
const CallToActionSection = lazy(() => import("./components/CallToActionSection"));

// Loading component for lazy loaded sections
const SectionLoader = () => (
  <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary-main)] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-[var(--text-secondary)]">Loading...</span>
      </div>
    </div>
  </div>
);

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [confettiActive, setConfettiActive] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    handleResize();
    const confettiTimer = setTimeout(() => setConfettiActive(false), 7000);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-[var(--background-default)] text-[var(--text-primary)] overflow-x-hidden">
      {confettiActive && windowSize.width > 0 && windowSize.height > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          tweenDuration={10000}
        />
      )}

      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <PhilosophySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <JourneySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SkillsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <EducationSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <VisionSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CallToActionSection />
        </Suspense>
      </motion.div>
    </div>
  );
};

export default About;
