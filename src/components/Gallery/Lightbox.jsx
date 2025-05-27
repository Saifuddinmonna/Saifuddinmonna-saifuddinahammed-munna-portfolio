import React, { useEffect } from 'react';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const Lightbox = ({ image, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const { src, alt, title, description, projectData } = image;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          onClick={onClose}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="relative">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

          {projectData && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {projectData.liveWebsite && (
                  <a
                    href={projectData.liveWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Live Website
                  </a>
                )}
                {projectData.liveWebsiteRepo && (
                  <a
                    href={projectData.liveWebsiteRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    GitHub Repository
                  </a>
                )}
              </div>

              {projectData.technology && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h3>
                  <p className="text-gray-600 dark:text-gray-300">{projectData.technology}</p>
                </div>
              )}

              {projectData.overview && projectData.overview.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Overview</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    {projectData.overview.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lightbox; 