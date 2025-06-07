import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { galleryData, categories } from "../data/galleryData";
import { ThemeContext } from "../App";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaInfoCircle,
  FaThLarge,
  FaList,
  FaAdjust,
  FaFont,
  FaPalette,
  FaTh,
} from "react-icons/fa";

const GalleryPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [layout, setLayout] = useState("grid-3"); // 'grid-3', 'grid-2', or 'list'
  const [cardStyle, setCardStyle] = useState({
    fontSize: "base",
    fontFamily: "sans",
    cardColor: "default",
    hoverEffect: "lift",
  });

  const filteredProjects =
    selectedCategory === "all"
      ? galleryData
      : galleryData.filter(project => project.category === selectedCategory);

  const handleImageClick = project => {
    const images = [
      { src: project.image, alt: project.title },
      ...project.additionalImages.map(img => ({
        src: img,
        alt: `${project.title} - Additional View`,
      })),
    ];
    setCurrentImages(images);
    setLightboxOpen(true);
  };

  const fontSizes = {
    small: "text-sm",
    base: "text-base",
    large: "text-lg",
  };

  const fontFamilies = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  };

  const cardColors = {
    default: isDarkMode ? "bg-gray-800" : "bg-white",
    primary: isDarkMode ? "bg-blue-900" : "bg-blue-50",
    secondary: isDarkMode ? "bg-purple-900" : "bg-purple-50",
  };

  const hoverEffects = {
    lift: "hover:-translate-y-2 hover:shadow-xl",
    scale: "hover:scale-105 hover:shadow-xl",
    glow: "hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]",
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "grid-3":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      case "grid-2":
        return "grid grid-cols-1 md:grid-cols-2 gap-8";
      case "list":
        return "flex flex-col gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <Helmet>
        <title>Project Gallery | Saifuddin Ahammed Monna</title>
        <meta
          name="description"
          content="Explore my portfolio of web development projects, including e-commerce platforms, news portals, and interactive applications."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold mb-8 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Project Gallery
        </motion.h1>

        {/* Controls Section */}
        <div className="mb-8 p-4 rounded-lg bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {/* Layout Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setLayout("grid-3")}
                className={`p-2 rounded-lg ${
                  layout === "grid-3" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                } transition-colors`}
                title="3 Columns"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setLayout("grid-2")}
                className={`p-2 rounded-lg ${
                  layout === "grid-2" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                } transition-colors`}
                title="2 Columns"
              >
                <FaTh />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2 rounded-lg ${
                  layout === "list" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                } transition-colors`}
                title="List View"
              >
                <FaList />
              </button>
            </div>

            {/* Style Controls */}
            <div className="flex gap-4">
              {/* Font Size */}
              <div className="flex items-center gap-2">
                <FaFont className="text-gray-600 dark:text-gray-400" />
                <select
                  value={cardStyle.fontSize}
                  onChange={e => setCardStyle({ ...cardStyle, fontSize: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="base">Base</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Card Color */}
              <div className="flex items-center gap-2">
                <FaPalette className="text-gray-600 dark:text-gray-400" />
                <select
                  value={cardStyle.cardColor}
                  onChange={e => setCardStyle({ ...cardStyle, cardColor: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1"
                >
                  <option value="default">Default</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>

              {/* Hover Effect */}
              <div className="flex items-center gap-2">
                <FaAdjust className="text-gray-600 dark:text-gray-400" />
                <select
                  value={cardStyle.hoverEffect}
                  onChange={e => setCardStyle({ ...cardStyle, hoverEffect: e.target.value })}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1"
                >
                  <option value="lift">Lift</option>
                  <option value="scale">Scale</option>
                  <option value="glow">Glow</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                selectedCategory === category.id
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Project Grid/List */}
        <motion.div layout className={getLayoutClass()}>
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-xl overflow-hidden shadow-lg relative group cursor-pointer ${
                  cardColors[cardStyle.cardColor]
                } ${hoverEffects[cardStyle.hoverEffect]} transition-all duration-300`}
              >
                <div className={`relative ${layout === "list" ? "flex" : ""}`}>
                  <div className={`${layout === "list" ? "w-1/3" : "aspect-video"}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => handleImageClick(project)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3
                          className={`text-xl font-semibold text-white ${
                            fontSizes[cardStyle.fontSize]
                          } ${fontFamilies[cardStyle.fontFamily]}`}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay with Project Details */}
                  <div
                    className={`absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      layout === "list" ? "w-2/3 left-1/3" : ""
                    }`}
                  >
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <p
                          className={`text-gray-200 ${fontSizes[cardStyle.fontSize]} ${
                            fontFamilies[cardStyle.fontFamily]
                          } mb-4`}
                        >
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 ${
                                fontSizes[cardStyle.fontSize]
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            onClick={e => e.stopPropagation()}
                          >
                            <FaGithub className="inline-block mr-2" />
                            View Code
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                            onClick={e => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt className="inline-block mr-2" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={currentImages}
        plugins={[Zoom, Thumbnails, Counter, Fullscreen]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          padding: 4,
          gap: 8,
          imageFit: "contain",
        }}
        counter={{
          container: {
            style: {
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "8px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "white",
              fontSize: "14px",
              textAlign: "center",
            },
          },
        }}
        carousel={{
          finite: false,
          preload: 2,
          padding: "16px",
          spacing: "16px",
          imageFit: "contain",
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        animation={{
          swipe: 250,
        }}
        render={{
          buttonPrev: currentImages.length <= 1 ? () => null : undefined,
          buttonNext: currentImages.length <= 1 ? () => null : undefined,
          iconPrev: () => (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          ),
          iconNext: () => (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ),
        }}
        fullscreen={{
          ref: null,
          auto: true,
        }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
          slide: {
            padding: "0 40px",
          },
        }}
      />
    </div>
  );
};

export default GalleryPage;
