import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaCode,
  FaBullseye,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
} from "react-icons/fa"; // Example icons
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiVercel,
  SiNetlify,
} from "react-icons/si"; // More specific icons

const AboutPageForHome = () => {
  // Renamed component to start with an uppercase letter
  const [confettiActive, setConfettiActive] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000); // Confetti for 5 seconds

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const skills = [
    { name: "HTML5", icon: <FaHtml5 className="text-orange-500" />, level: "Advanced" },
    { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" />, level: "Advanced" },
    {
      name: "JavaScript (ES6+)",
      icon: <FaJsSquare className="text-yellow-400" />,
      level: "Proficient",
    },
    { name: "React", icon: <FaReact className="text-sky-400" />, level: "Proficient" },
    { name: "Node.js", icon: <FaNodeJs className="text-green-500" />, level: "Intermediate" },
    {
      name: "Express.js",
      icon: <SiExpress className="text-gray-700 dark:text-gray-300" />,
      level: "Intermediate",
    },
    { name: "MongoDB", icon: <SiMongodb className="text-green-600" />, level: "Intermediate" },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="text-teal-400" />,
      level: "Proficient",
    },
    { name: "Git & GitHub", icon: <FaGitAlt className="text-red-500" />, level: "Proficient" },
    { name: "Firebase", icon: <SiFirebase className="text-yellow-500" />, level: "Beginner" },
    {
      name: "Vercel/Netlify",
      icon: (
        <>
          <SiVercel className="mr-1" /> <SiNetlify className="text-teal-500" />
        </>
      ),
      level: "Deployment",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      {confettiActive && windowSize.width && windowSize.height && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.1}
        />
      )}

      <motion.div
        className="max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- My Story Section --- */}

        {/* --- Skills Section --- */}
      </motion.div>
    </div>
  );
};

export default AboutPageForHome; // Export with the new uppercase name
