import React, { useState } from "react";
import GalleryGrid from "../components/Gallery/GalleryGrid";
import portfoliosData from "../components/MyPortfolios/portfolios.json";
import NavbarPage2 from "../components/NavbarPage/NavbarPage2";

const GalleryPage = () => {
  const [images] = useState(() => {
    return portfoliosData.flatMap(project =>
      project.image.map(img => ({
        src: `/images/${img}`,
        alt: `${project.name} - ${img}`,
        title: project.name,
        description: project.category,
        projectData: {
          name: project.name,
          category: project.category,
          liveWebsite: project.liveWebsite,
          liveWebsiteRepo: project.liveWebsiteRepo,
          liveServersite: project.liveServersite,
          liveServersiteRepo: project.liveServersiteRepo,
          technology: project.technology,
          overview: project.overview,
        },
      }))
    );
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>

      {/* Main content with padding for navbar */}
      <main className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Project Gallery
          </h1>

          {/* Instructions Section */}
          <div className="py-6    bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 mb-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              How to Use the Gallery
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                  1
                </span>
                <p className="text-sm">
                  Browse through the project images in the grid below. Each image represents a
                  different project.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                  2
                </span>
                <p className="text-sm">
                  Hover over any image to see project details including description and technology
                  stack.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                  3
                </span>
                <p className="text-sm">
                  Click on an image to view it in full size with additional project information.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                  4
                </span>
                <p className="text-sm">
                  Use the "Live Website" link at the bottom of each image to visit the project
                  directly.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                  5
                </span>
                <p className="text-sm">
                  Access the GitHub repository and technology details by hovering over the image.
                </p>
              </div>
            </div>
          </div>

          <GalleryGrid images={images} />
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;
