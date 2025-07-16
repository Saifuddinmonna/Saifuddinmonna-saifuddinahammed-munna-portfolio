import React, { lazy, Suspense } from "react";
import "../../assets/Main.css"; // Updated path to assets directory
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion"; // Framer Motion import kora
import { Link } from "react-router-dom"; // Add this import
import ResumeButtons from "../Buttons/ResumeButtons";

// Lazy load social links component
const SocialLinks = lazy(() => import("./SocialLinks"));

const HomePageHero = () => {
  // Optimized button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02, // Reduced scale for better performance
      transition: {
        type: "spring",
        stiffness: 300, // Reduced stiffness
        damping: 10,
      },
    },
    tap: {
      scale: 0.98, // Reduced scale
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <div className="mt-8 transition-all duration-300 hover:-translate-y-1">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-700 dark:to-blue-gray-900 rounded-2xl mx-2 md:mx-4 p-3 shadow-xl">
        <div className="flex items-center justify-around flex-col lg:flex-row-reverse gap-8 lg:gap-12">
          {/* Optimized image loading */}
          <motion.div
            className="relative w-64 h-64 md:w-96 md:h-96"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="android-chrome-512x512.png"
              className="mask mask-hexagon w-full h-full object-cover rounded-lg shadow-2xl border-4 border-white/20"
              alt="Saifuddin Ahammed Munna"
              loading="eager"
              width="384"
              height="384"
              style={{ willChange: "transform" }}
            />
          </motion.div>
          <div className="p-2 pb-6 lg:p-6 text-center lg:text-left">
            {" "}
            {/* Text alignment adjusted for consistency */}
            <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-6 tracking-tight font-sans">
              {" "}
              {/* Changed h3 to h1 for semantic hero title */}
              Saifuddin Ahammed Munna
            </h1>
            <h2 className="text-2xl font-semibold text-white/95 mb-2 tracking-wide font-sans">
              {" "}
              {/* Changed h3 to h2, adjusted color */}
              <Typewriter
                options={{
                  strings: ["I am a full stack web developer "],
                  autoStart: true,
                  loop: true,
                  delay: 150,
                  cursor: "|",
                  deleteSpeed: 50,
                }}
              />
            </h2>
            <h3 className="py-2 text-2xl font-medium text-white/90 tracking-wide font-sans">
              {" "}
              {/* Changed h3, adjusted size and color */}
              <Typewriter
                options={{
                  strings: ["Proficiency in MERN Stack with SQL"],
                  autoStart: true,
                  loop: true,
                  delay: 150,
                  cursor: "|",
                  deleteSpeed: 50,
                }}
              />
            </h3>
            {/* <p className="text-white/90 italic text-lg mt-4 leading-relaxed font-sans">
              Passionate full-stack developer with expertise in MERN stack with SQL. Specializing in
              building responsive, user-friendly web applications with modern technologies and best
              practices.
            </p> */}
            {/* "Passionate Web Developer & Educator" section removed */}
            <div className="mt-8">
              <ResumeButtons />
            </div>
          </div>
        </div>
      </div>
      {/* Social Links Section */}
      <div className="mt-6">
        <Suspense fallback={<div className="flex justify-center">Loading social links...</div>}>
          <SocialLinks />
        </Suspense>
      </div>
      <section className=" container location-container my-5"></section>{" "}
      {/* This seems like a placeholder, can be removed if not used */}
    </div>
  );
};

export default React.memo(HomePageHero);
