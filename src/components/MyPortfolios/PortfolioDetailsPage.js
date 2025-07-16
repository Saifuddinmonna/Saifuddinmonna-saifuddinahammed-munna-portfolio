import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaServer,
  FaArrowLeft,
  FaCalendarAlt,
  FaCode,
  FaEye,
  FaRocket,
  FaTools,
  FaPalette,
  FaCog,
  FaFileAlt,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getProjectWork } from "../../services/apiService";
import LoadingSkeleton from "./MyPortfolioLayout/components/LoadingSkeleton";

const PortfolioDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllMdDocs, setShowAllMdDocs] = useState(false);
  const [expandedMdDocs, setExpandedMdDocs] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log("🎯 PortfolioDetailsPage - projectId from params:", projectId);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setError("No project ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("🔍 Fetching project details for ID:", projectId);
        const response = await getProjectWork(projectId);

        if (response && response.data) {
          setProject(response.data);
          console.log("✅ Project details loaded successfully:", response.data);
        } else {
          console.error("❌ Invalid response structure:", response);
          setError("Invalid project data received");
        }
      } catch (error) {
        console.error("❌ Error fetching project details:", error);

        if (error.response?.status === 404) {
          setError("Project not found");
        } else if (error.response?.status === 401) {
          setError("Authentication required");
        } else if (error.message) {
          setError(`Failed to load project: ${error.message}`);
        } else {
          setError("Failed to load project details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Auto-rotate images every 3000ms if there are multiple images
  useEffect(() => {
    if (!project?.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % project.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [project?.images]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-default)] pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Loading Project Details
            </h2>
            <p className="text-[var(--text-secondary)]">
              Please wait while we fetch the project information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[var(--background-default)] pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-[var(--background-paper)] rounded-xl p-8 shadow-lg">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                {error || "Project not found"}
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                {error === "Project not found"
                  ? "The project you're looking for doesn't exist or has been removed."
                  : "We encountered an issue while loading the project details."}
              </p>
              <div className="space-y-3">
                <Link
                  to="/mywork"
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Portfolio
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full mt-3 px-6 py-3 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-colors border border-[var(--border-color)]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parse documentation if it's HTML
  const parseDocumentation = doc => {
    if (typeof doc === "string" && doc.includes("<ul>")) {
      return { __html: doc };
    }
    return null;
  };

  const documentationHtml = parseDocumentation(project.documentation);

  const handleCardPrev = () => {
    setCurrentImageIndex(prev => (prev - 1 + project.images.length) % project.images.length);
  };

  const handleCardNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % project.images.length);
  };

  return (
    <div className="min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/mywork"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Portfolio
              </Link>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <p className="text-xl opacity-90">{project.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm opacity-80">
                <FaCalendarAlt className="mr-1" />
                Last Uploaded Date: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Images */}
            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaEye className="mr-2 text-[var(--primary-main)]" />
                  Project Screenshots ({project.images.length})
                </h2>

                {/* Main Image Carousel */}
                <div className="relative mb-4">
                  <div className="relative w-full h-96 rounded-lg overflow-hidden">
                    <PhotoProvider>
                      {/* Main Image */}
                      <PhotoView index={currentImageIndex}>
                        <motion.img
                          key={currentImageIndex}
                          src={
                            project.images[currentImageIndex].thumbnailUrl ||
                            project.images[currentImageIndex].fullImageUrl
                          }
                          alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer group"
                          initial={{ opacity: 0, x: 120, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -120, scale: 1.05 }}
                          transition={{
                            duration: 3.6,
                            ease: "easeInOut",
                            type: "spring",
                            stiffness: 50,
                            damping: 25,
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.5 },
                          }}
                        />
                      </PhotoView>

                      {/* Click to enlarge indicator */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                          Click to enlarge
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={handleCardPrev}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200 z-10"
                          >
                            <FaChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCardNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200 z-10"
                          >
                            <FaChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {project.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {project.images.length}
                        </div>
                      )}
                    </PhotoProvider>
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {project.images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    <PhotoProvider>
                      {project.images.map((image, index) => (
                        <PhotoView key={image._id || index} index={index}>
                          <motion.img
                            src={image.thumbnailUrl || image.fullImageUrl}
                            alt={`${project.name} thumbnail ${index + 1}`}
                            className={`w-full h-16 object-cover rounded cursor-pointer ${
                              index === currentImageIndex ? "ring-2 ring-[var(--primary-main)]" : ""
                            }`}
                            initial={{ opacity: 0, x: 30, y: 10, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              y: 0,
                              scale: index === currentImageIndex ? 1.05 : 1,
                            }}
                            transition={{
                              duration: 2.0,
                              delay: index * 0.15,
                              ease: "easeOut",
                              type: "spring",
                              stiffness: 80,
                              damping: 18,
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                            whileHover={{
                              scale: 1.1,
                              x: -5,
                              transition: { duration: 0.3 },
                            }}
                          />
                        </PhotoView>
                      ))}
                    </PhotoProvider>
                  </div>
                )}
              </motion.div>
            )}

            {/* Project Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaRocket className="mr-2 text-[var(--primary-main)]" />
                Project Overview
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                {project.overview}
              </p>
            </motion.div>

            {/* Documentation */}
            {project.documentation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaTools className="mr-2 text-[var(--primary-main)]" />
                  Features & Documentation
                </h2>
                {documentationHtml ? (
                  <div
                    className="prose prose-lg max-w-none text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={documentationHtml}
                  />
                ) : (
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {project.documentation}
                  </p>
                )}
              </motion.div>
            )}

            {/* Markdown Documentation */}
            {project.mdDocumentation && project.mdDocumentation.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaFileAlt className="mr-2 text-[var(--primary-main)]" />
                    Markdown Documentation ({project.mdDocumentation.length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAllMdDocs(!showAllMdDocs)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      {showAllMdDocs ? <FaEyeSlash /> : <FaEye />}
                      {showAllMdDocs ? "Hide All" : "Show All"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {project.mdDocumentation.map((doc, index) => (
                    <div
                      key={doc._id || index}
                      className="border border-[var(--border-color)] rounded-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 bg-[var(--background-elevated)]">
                        <div className="flex items-center gap-2">
                          <FaFileAlt className="text-[var(--primary-main)]" />
                          <span className="font-medium text-[var(--text-primary)]">
                            {doc.title || `Document ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedMdDocs(prev => ({
                                ...prev,
                                [index]: !prev[index],
                              }))
                            }
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-[var(--background-paper)] text-[var(--text-primary)] rounded hover:bg-[var(--background-default)] transition-colors"
                          >
                            {expandedMdDocs[index] ? <FaChevronUp /> : <FaChevronDown />}
                            {expandedMdDocs[index] ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      {(showAllMdDocs || expandedMdDocs[index]) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-[var(--background-default)]"
                        >
                          <div className="prose prose-lg max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-code:bg-[var(--background-elevated)] prose-code:text-[var(--text-primary)] prose-pre:bg-[var(--background-elevated)] prose-pre:text-[var(--text-primary)]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {doc.content || ""}
                            </ReactMarkdown>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Markdown Documentation Message */}
            {(!project.mdDocumentation || project.mdDocumentation.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-[var(--primary-main)]" />
                  Markdown Documentation
                </h2>
                <p className="text-[var(--text-secondary)] text-center py-8">
                  There are no Markdown files available for this project.
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {project.liveWebsite && (
                  <a
                    href={project.liveWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Visit Live Site
                  </a>
                )}
                {project.liveWebsiteRepo && (
                  <a
                    href={project.liveWebsiteRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-colors border border-[var(--border-color)]"
                  >
                    <FaGithub className="mr-2" />
                    View Source Code
                  </a>
                )}
                {project.liveServersite && (
                  <a
                    href={project.liveServersite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-[var(--success-main)] text-white rounded-lg hover:bg-[var(--success-dark)] transition-colors"
                  >
                    <FaServer className="mr-2" />
                    Server Deployment
                  </a>
                )}
                {project.liveServersiteRepo && (
                  <a
                    href={project.liveServersiteRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-colors border border-[var(--border-color)]"
                  >
                    <FaGithub className="mr-2" />
                    Server Code
                  </a>
                )}
              </div>
            </motion.div>

            {/* Technologies */}
            {project.technology && project.technology.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCode className="mr-2 text-[var(--primary-main)]" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-[var(--primary-main)]" />
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.updatedAt && (
                  <div className="flex items-center">
                    <FaCog className="mr-2 text-[var(--primary-main)]" />
                    <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FaPalette className="mr-2 text-[var(--primary-main)]" />
                  <span>Category: {project.category}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailsPage;
