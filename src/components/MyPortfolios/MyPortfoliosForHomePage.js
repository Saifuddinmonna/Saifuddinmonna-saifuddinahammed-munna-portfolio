import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaServer } from "react-icons/fa";
import NavbarPage2 from "../NavbarPage/NavbarPage";
import Footer from "../CommonComponents/Footer";

// Assuming portfolios.json is in the public folder or accessible via fetch
import allProjectsData from "./portfolios.json"; // Direct import if in src

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: index => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: index * 0.1,
    },
  }),
};

const MyPortfolios = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    // If using direct import:
    setRecentProjects(allProjectsData.slice(0, 3)); // Show first 3 projects as a teaser

    // If fetching from public folder:
    // fetch('/portfolios.json') // Make sure this path is correct
    //     .then(res => res.json())
    //     .then(data => {
    //         setRecentProjects(data.slice(0, 3)); // Show first 3 projects
    //     })
    //     .catch(error => console.error("Failed to load projects for teaser:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <section className="py-12 md:py-16 lg:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 lg:mb-16 text-gray-800 dark:text-gray-100"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                Explore My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Recent Work
                </span>
              </motion.h2>

              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-12 md:mb-16">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.name}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      custom={index}
                      whileHover={{ y: -8 }}
                      onHoverStart={() => setHoveredProject(project.name)}
                      onHoverEnd={() => setHoveredProject(null)}
                    >
                      <Link to={`/projects/${encodeURIComponent(project.name)}`} className="block">
                        <div className="relative aspect-video overflow-hidden">
                          <motion.img
                            src={`/images/${project.image[0]}`}
                            alt={project.name}
                            className="w-full h-full object-cover transition-all duration-300 dark:brightness-75 dark:contrast-110"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-all duration-300" />
                        </div>
                      </Link>
                      <div className="p-5 md:p-6 lg:p-7">
                        <Link
                          to={`/projects/${encodeURIComponent(project.name)}`}
                          className="block mb-3"
                        >
                          <motion.h3
                            className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            {project.name}
                          </motion.h3>
                        </Link>
                        <motion.p
                          className="text-sm md:text-base text-indigo-500 dark:text-indigo-400 mb-3 md:mb-4"
                          whileHover={{ x: 5 }}
                        >
                          {project.category}
                        </motion.p>
                        <motion.p
                          className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-2 mb-4 md:mb-5"
                          whileHover={{ x: 5 }}
                        >
                          {project.overview[0]}
                        </motion.p>

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-3 mt-4 md:mt-5">
                          {project.liveWebsite && (
                            <motion.a
                              href={project.liveWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaExternalLinkAlt className="text-sm md:text-base" />
                              <span>Live</span>
                            </motion.a>
                          )}
                          {project.liveWebsiteRepo && (
                            <motion.a
                              href={project.liveWebsiteRepo}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaGithub className="text-sm md:text-base" />
                              <span>Code</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  className="text-center text-gray-600 dark:text-gray-400 mb-12 md:mb-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Loading projects...
                </motion.p>
              )}

              <motion.div
                className="text-center mt-8 md:mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/PortfolioLayout">
                  <motion.button
                    className="relative group px-8 py-3 md:px-10 md:py-4 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 text-base md:text-lg">View All Projects</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 border-2 border-indigo-300 dark:border-indigo-600 rounded-lg" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPortfolios;
