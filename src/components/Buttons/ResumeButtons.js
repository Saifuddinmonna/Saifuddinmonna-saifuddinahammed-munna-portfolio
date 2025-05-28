import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ResumeButtons = () => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
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

  return (
    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
      <a
        target="_blank"
        href="https://drive.google.com/open?id=154ZAjEGKPwBAw_wZe0Ij102ZSx_GR4UL&authuser=0&usp=drive_link"
        rel="noreferrer"
        className="no-underline"
      >
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="shadow-2xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border border-white/20 flex items-center gap-2"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View My CV
        </motion.button>
      </a>
      <a
        target="_blank"
        href="https://docs.google.com/document/d/1swwhu1h5hZ7TdFsgEkk1HpNNr5g_Dzq7/edit?usp=drive_link&ouid=106856683926414141088&rtpof=true&sd=true"
        rel="noreferrer"
        className="no-underline"
      >
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border border-white/20 flex items-center gap-2"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View My Resume
        </motion.button>
      </a>
      <Link to="/contact" className="no-underline">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white/80 hover:text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border border-white/20 flex items-center gap-2"
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Let's Connect
        </motion.button>
      </Link>
    </div>
  );
};

export default ResumeButtons;
