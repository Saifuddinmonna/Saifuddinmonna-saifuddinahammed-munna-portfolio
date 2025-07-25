import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaServer } from "react-icons/fa";
import NavbarPage2 from "../layout/NavbarPage/NavbarPage";
import Footer from "../layout/Footer";
import { getAllPortfolioProjects } from "../../services/apiService";
import { CompactSpinner } from "../LoadingSpinner";

// Animation variants for cards
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
  // ===== State Management =====
  const [recentProjects, setRecentProjects] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Fetch Portfolio Data =====
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all projects and limit to 6 on the frontend
        const response = await getAllPortfolioProjects();

        if (response && response.data && Array.isArray(response.data)) {
          // Limit to 6 projects for the home page
          setRecentProjects(response.data.slice(0, 6));
        } else {
          console.warn("Invalid response format:", response);
          setRecentProjects([]);
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setError("Failed to load projects. Please try again later.");
        setRecentProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // ===== Render Loading State =====
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarPage2 />
        </div>
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <section className="py-12 md:py-16 lg:py-20 bg-[var(--background-paper)]/50 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-color)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 lg:mb-16 text-[var(--text-primary)]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Explore My{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
                    Recent Work
                  </span>
                </motion.h2>
                <CompactSpinner message="Loading recent projects..." size="large" />
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ===== Render Error State =====
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarPage2 />
        </div>
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <section className="py-12 md:py-16 lg:py-20 bg-[var(--background-paper)]/50 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-color)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 lg:mb-16 text-[var(--text-primary)]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Explore My{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
                    Recent Work
                  </span>
                </motion.h2>
                <motion.div
                  className="text-center text-[var(--text-secondary)] mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ===== Main Render =====
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <section className="py-12 md:py-16 lg:py-20 bg-[var(--background-paper)]/50 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 lg:mb-16 text-[var(--text-primary)]"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                Explore My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
                  Recent Work
                </span>
              </motion.h2>

              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-12 md:mb-16">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.name || project._id || index}
                      className="group relative bg-[var(--background-paper)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-lg)] border border-[var(--border-color)]"
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      custom={index}
                      whileHover={{ y: -8 }}
                      onHoverStart={() => setHoveredProject(project.name)}
                      onHoverEnd={() => setHoveredProject(null)}
                    >
                      <Link
                        to={`/project/${project._id || encodeURIComponent(project.name)}`}
                        className="block"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <motion.img
                            src={
                              project.image && project.image[0]
                                ? `/images/${project.image[0]}`
                                : "/images/1.JPG"
                            }
                            alt={project.name || "Project"}
                            className="w-full h-full object-cover transition-all duration-300 dark:brightness-75 dark:contrast-110"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            onError={e => {
                              e.target.src = "/images/1.JPG";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                      <div className="p-5 md:p-6 lg:p-7">
                        <Link
                          to={`/project/${project._id || encodeURIComponent(project.name)}`}
                          className="block mb-3"
                        >
                          <motion.h3
                            className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-main)] dark:group-hover:text-[var(--primary-light)] transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            {project.name || "Untitled Project"}
                          </motion.h3>
                        </Link>
                        <motion.p
                          className="text-sm md:text-base text-[var(--primary-main)] dark:text-[var(--primary-light)] mb-3 md:mb-4"
                          whileHover={{ x: 5 }}
                        >
                          {project.category || "Uncategorized"}
                        </motion.p>
                        <motion.p
                          className="text-[var(--text-secondary)] text-sm md:text-base line-clamp-2 mb-4 md:mb-5"
                          whileHover={{ x: 5 }}
                        >
                          {project.overview &&
                          Array.isArray(project.overview) &&
                          project.overview[0]
                            ? project.overview[0]
                            : project.description || "No description available"}
                        </motion.p>

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-3 mt-4 md:mt-5">
                          {project.liveWebsite && (
                            <motion.a
                              href={project.liveWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white rounded-lg hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] transition-all duration-300"
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
                              className="flex items-center gap-2 px-4 py-2 text-sm md:text-base bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-all duration-300 border border-[var(--border-color)]"
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
                  className="text-center text-[var(--text-secondary)] mb-12 md:mb-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No projects available at the moment.
                </motion.p>
              )}

              <motion.div
                className="text-center mt-8 md:mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/portfolio">
                  <motion.button
                    className="relative group px-8 py-3 md:px-10 md:py-4 text-[var(--primary-main)] dark:text-[var(--primary-light)] font-bold rounded-lg overflow-hidden border border-[var(--primary-main)] dark:border-[var(--primary-light)] hover:border-[var(--primary-dark)] dark:hover:border-[var(--primary-main)] transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 text-base md:text-lg">View All Projects</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-main)]/10 to-[var(--secondary-main)]/10 dark:from-[var(--primary-light)]/20 dark:to-[var(--secondary-light)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
