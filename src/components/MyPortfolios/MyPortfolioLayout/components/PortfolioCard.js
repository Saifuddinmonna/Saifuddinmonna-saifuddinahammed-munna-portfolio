import React from "react";
import { motion } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { FaGithub, FaServer, FaExternalLinkAlt } from "react-icons/fa";
import PortfolioOverview from "./PortfolioOverview";

const PortfolioCard = ({
  project,
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
  const photoProviderImages = Array.isArray(project.images)
    ? project.images.map((img, idx) => ({
        src: img.fullImageUrl,
        key: idx,
      }))
    : [];

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
        className={`$${
          viewMode === VIEW_MODES.LIST ? "md:w-1/3 lg:w-1/4 p-2" : "aspect-video"
        } relative overflow-hidden`}
      >
        <PhotoProvider images={photoProviderImages}>
          {viewMode === VIEW_MODES.LIST ? (
            <div className="flex flex-wrap gap-2 justify-start items-start h-full overflow-y-auto">
              {Array.isArray(project.images) &&
                project.images.map((img, index) => (
                  <PhotoView key={`${project.name}-img-${index}`} index={index}>
                    <motion.img
                      src={img.thumbnailUrl || img.fullImageUrl}
                      alt={`${project.name} image ${index + 1}`}
                      className="h-24 w-auto object-contain rounded shadow-sm cursor-pointer hover:opacity-80 transition-opacity duration-300"
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  </PhotoView>
                ))}
            </div>
          ) : (
            Array.isArray(project.images) &&
            project.images.length > 0 && (
              <PhotoView index={0}>
                <motion.img
                  src={project.images[0].fullImageUrl}
                  alt={`${project.name} image 1`}
                  className="w-full h-full object-cover transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </PhotoView>
            )
          )}
        </PhotoProvider>
        {/* Conditional overlays for GRID modes only */}
        {viewMode !== VIEW_MODES.LIST &&
          Array.isArray(project.images) &&
          project.images.length > 0 && (
            <>
              {viewMode === VIEW_MODES.GRID_1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              {viewMode === VIEW_MODES.GRID_2 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              {viewMode === VIEW_MODES.GRID_3 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          {project.overview[0]}
        </p>
        {viewMode === VIEW_MODES.LIST && (
          <PortfolioOverview
            overview={project.overview}
            showMore={showMore}
            setShowMore={setShowMore}
          />
        )}

        {/* Project Links with Tooltips */}
        <div className="flex flex-wrap gap-3 mt-4">
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
