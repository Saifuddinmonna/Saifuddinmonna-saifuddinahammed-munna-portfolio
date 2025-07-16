import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEnvelope, FaUserGraduate, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const HeroSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <motion.div className="lg:w-1/2 text-center lg:text-left" variants={itemVariants}>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Hello, I'm</span>
            <span className="block text-[var(--primary-main)]">Saifuddin Ahammed Monna</span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A Passionate MERN Stack Developer & Lifelong Learner, crafting intuitive and performant
            web experiences.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="no-underline inline-flex items-center bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-main)] hover:from-[var(--primary-main)] hover:to-[var(--primary-main)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <FaEnvelope className="mr-2" /> Get In Touch
            </Link>
            <Link
              to="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[var(--background-paper)] hover:bg-[var(--background-paper)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <FaUserGraduate className="mr-2" /> View Resume
            </Link>
          </motion.div>
          <motion.div
            className="flex justify-center lg:justify-start space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="https://github.com/Saifuddinmonna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
            >
              <FaGithub size={32} />
            </a>
            <a
              href="https://www.linkedin.com/in/saifuddin-ahammed-monna/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
            >
              <FaLinkedin size={32} />
            </a>
            <a
              href="https://saifuddinahammed-monna.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio Website"
              className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
            >
              <FaGlobe size={32} />
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120, delay: 0.2 }}
        >
          <img
            src="android-chrome-512x512.png"
            alt="Saifuddin Ahammed Monna"
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full object-cover shadow-2xl border-8 border-[var(--primary-main)]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
