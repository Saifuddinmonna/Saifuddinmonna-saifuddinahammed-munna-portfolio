import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  FaGithub,
  FaServer,
  FaExternalLinkAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import PortfolioOverview from "./PortfolioOverview";

const PortfolioCard = ({
  project,
  cardIndex,
  cardCount,
  viewMode,
  currentStyle,
  styleClasses,
  isDarkMode,
  showMore,
  setShowMore,
  commonButtonStyles,
  buttonVariants,
  cardVariants,
  VIEW_MODES,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const autoPlayDelay = 3000 + cardIndex * 2000;
  const autoPlayInterval = Math.max(cardCount, 1) * 2000;

  const changeImage = (nextIndex, direction) => {
    setSlideDirection(direction);
    setCurrentImageIndex(nextIndex);
  };

  // Change one visible card every two seconds, then repeat the same sequence.
  useEffect(() => {
    if (!Array.isArray(project.images) || project.images.length <= 1) return;

    let intervalId;
    const showNextImage = () => {
      setSlideDirection(1);
      setCurrentImageIndex((previousIndex) =>
        (previousIndex + 1) % project.images.length
      );
    };

    const timeoutId = setTimeout(() => {
      showNextImage();
      intervalId = setInterval(showNextImage, autoPlayInterval);
    }, autoPlayDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [autoPlayDelay, autoPlayInterval, project.images]);

  const handleCardPrev = () => {
    changeImage(
      (currentImageIndex - 1 + project.images.length) % project.images.length,
      -1
    );
  };

  const handleCardNext = () => {
    changeImage((currentImageIndex + 1) % project.images.length, 1);
  };

  return (
    <motion.div
      key={project.name}
      className={`rounded-xl overflow-hidden transition-all duration-300 ${styleClasses.card} ${
        viewMode === VIEW_MODES.LIST ? "md:flex md:flex-row items-start" : ""
      }`}
      variants={cardVariants}
      whileHover={{
        y:
          viewMode === VIEW_MODES.GRID_1
            ? -5
            : viewMode === VIEW_MODES.GRID_2
            ? -5
            : viewMode === VIEW_MODES.GRID_3
            ? -5
            : 0,
        boxShadow: isDarkMode
          ? "0 10px 15px -3px rgba(0 0 0 / 0.4)"
          : "0 10px 15px -3px rgba(0 0 0 / 0.1)",
      }}
    >
      {/* Project Image(s) */}
      <div
        className={`${
          viewMode === VIEW_MODES.LIST ? "md:w-1/3 lg:w-1/4 p-2" : "aspect-video"
        } relative overflow-hidden`}
      >
        {viewMode === VIEW_MODES.LIST ? (
          <div className="flex flex-wrap gap-2 justify-start items-start h-full overflow-y-auto">
            {Array.isArray(project.images) &&
              project.images.map((img, index) => (
                <PhotoView key={`${project.name}-img-${index}`} index={index}>
                  <motion.img
                    src={img.thumbnailUrl || img.fullImageUrl}
                    alt={`${project.name} image ${index + 1}`}
                    className="h-24 w-auto object-contain rounded shadow-sm cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 120,
                      damping: 15,
                    }}
                    whileHover={{
                      scale: 1.1,
                      opacity: 0.8,
                      transition: { duration: 0.3 },
                    }}
                  />
                </PhotoView>
              ))}
          </div>
        ) : (
          Array.isArray(project.images) &&
          project.images.length > 0 && (
            <div className="relative w-full h-full">
              {/* Main Image */}
              <div className="group relative h-full w-full">
                <PhotoView
                  src={project.images[currentImageIndex].fullImageUrl}
                  index={currentImageIndex}
                >
                  <motion.img
                    key={currentImageIndex}
                    src={
                      project.images[currentImageIndex].thumbnailUrl ||
                      project.images[currentImageIndex].fullImageUrl
                    }
                    alt={`${project.name} image ${currentImageIndex + 1}`}
                    className="h-full w-full cursor-pointer object-cover"
                    initial={{ opacity: 0, x: slideDirection * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    whileHover={{ scale: 1.03 }}
                  />
                </PhotoView>

                {/* Click to enlarge indicator */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
                  <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Click to enlarge
                  </div>
                </div>

                {/* Navigation Arrows for Card */}
                {project.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous project image"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardPrev();
                      }}
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors duration-200 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next project image"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardNext();
                      }}
                      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors duration-200 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <FaChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {/* Conditional overlays for GRID modes only */}
        {viewMode !== VIEW_MODES.LIST &&
          Array.isArray(project.images) &&
          project.images.length > 0 && (
            <>
              {viewMode === VIEW_MODES.GRID_1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              )}
              {viewMode === VIEW_MODES.GRID_2 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              )}
              {viewMode === VIEW_MODES.GRID_3 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              )}
            </>
          )}
      </div>
      {/* Project Details */}
      <div className={`p-5 md:p-6 lg:p-7 ${viewMode === VIEW_MODES.LIST ? "flex-1" : ""}`}>
        <h3 className={`text-xl md:text-2xl font-semibold mb-3 ${styleClasses.title}`}>
          {project.name}
        </h3>
        <p className={`text-sm md:text-base mb-3 ${styleClasses.category}`}>{project.category}</p>
        <p className={`text-sm md:text-base line-clamp-3 mb-4 ${styleClasses.description}`}>
          {Array.isArray(project.overview)
            ? project.overview[0]
            : typeof project.overview === "string"
            ? project.overview.split(/\r?\n|\. /)[0]
            : ""}
        </p>
        {viewMode === VIEW_MODES.LIST && (
          <PortfolioOverview
            overview={
              Array.isArray(project.overview)
                ? project.overview
                : typeof project.overview === "string"
                ? project.overview.split(/\r?\n|\. /).filter(Boolean)
                : []
            }
            showMore={showMore}
            setShowMore={setShowMore}
          />
        )}

        {/* Project Links with Tooltips */}
        <div className="flex flex-wrap gap-3 mt-4">
          {/* View Details Button */}
          <motion.div
            className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles} cursor-pointer`}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Link to={`/project/${project._id}`} className="flex items-center gap-2">
              <FaEye className="text-sm md:text-base" />
              <span>View Details</span>
            </Link>
          </motion.div>

          {project.liveWebsite && (
            <motion.a
              href={project.liveWebsite}
              target="_blank"
              rel="noreferrer"
              className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
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
              className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <FaGithub className="text-sm md:text-base" />
              <span>Code</span>
            </motion.a>
          )}
          {project.liveServersite && (
            <motion.a
              href={project.liveServersite}
              target="_blank"
              rel="noreferrer"
              className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <FaServer className="text-sm md:text-base" />
              <span>Server</span>
            </motion.a>
          )}
          {project.liveServersiteRepo && (
            <motion.a
              href={project.liveServersiteRepo}
              target="_blank"
              rel="noreferrer"
              className={`${styleClasses.button} flex items-center gap-2 px-4 py-2 text-sm md:text-base rounded-lg ${commonButtonStyles}`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <FaGithub className="text-sm md:text-base" />
              <span>Server Code</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
