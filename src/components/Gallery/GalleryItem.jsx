import React from "react";
import { PhotoView } from "react-photo-view";
import { FaExternalLinkAlt, FaEye } from "react-icons/fa";

const GalleryItem = ({ image, index, viewMode = "grid-3" }) => {
  const { src, alt, title, description, projectData } = image;

  // Check if it's list view
  const isListView = viewMode === "list";

  if (isListView) {
    return (
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Image Section */}
        <div className="md:w-1/3">
          <PhotoView src={src} index={index}>
            <div className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out aspect-[4/3] group">
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <FaEye className="w-4 h-4" />
                  <span>Click to view</span>
                </div>
              </div>
            </div>
          </PhotoView>
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)] mb-3">{description}</p>
            {projectData?.overview && (
              <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
                {Array.isArray(projectData.overview)
                  ? projectData.overview[0]
                  : projectData.overview}
              </p>
            )}
            {projectData?.technology && (
              <p className="text-sm text-[var(--primary-main)] mb-4">
                <strong>Tech:</strong>{" "}
                {Array.isArray(projectData.technology)
                  ? projectData.technology.join(", ")
                  : projectData.technology}
              </p>
            )}
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-3">
            {projectData?.liveWebsite && (
              <a
                href={projectData.liveWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white rounded-lg hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] transition-all duration-300"
                onClick={e => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
                <span>Live Website</span>
              </a>
            )}
            {projectData?.liveWebsiteRepo && (
              <a
                href={projectData.liveWebsiteRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background-paper)] transition-all duration-300 border border-[var(--border-color)]"
                onClick={e => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view (original design)
  return (
    <PhotoView src={src} index={index}>
      <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out aspect-[4/3]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        {/* Always visible website link at bottom */}
        {projectData?.liveWebsite && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 p-2 backdrop-blur-sm">
            <a
              href={projectData.liveWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-sm text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-all duration-300 px-2 group/link"
              onClick={e => e.stopPropagation()}
            >
              <span className="flex items-center transform group-hover/link:translate-x-1 transition-transform duration-300">
                <FaExternalLinkAlt className="mr-2 group-hover/link:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{title}</span>
              </span>
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 blur-sm"></span>
                <span className="relative">Live Website</span>
              </span>
            </a>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex flex-col justify-end p-4 z-10">
          <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="text-xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100">
              {title}
            </h3>
            <p className="text-gray-200 mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-150">
              {description}
            </p>
            {projectData && (
              <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                {projectData.liveWebsiteRepo && (
                  <a
                    href={projectData.liveWebsiteRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-all duration-300 bg-black/40 px-3 py-1.5 rounded hover:bg-black/60"
                    onClick={e => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    GitHub Repository
                  </a>
                )}
                {projectData.technology && (
                  <p className="text-sm text-gray-300 bg-black/40 px-3 py-1.5 rounded">
                    Tech:{" "}
                    {Array.isArray(projectData.technology)
                      ? projectData.technology.join(", ")
                      : projectData.technology}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PhotoView>
  );
};

export default GalleryItem;
