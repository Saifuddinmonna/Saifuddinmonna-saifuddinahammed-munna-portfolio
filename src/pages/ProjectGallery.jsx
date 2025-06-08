import React from 'react';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import Lightbox from '../components/Gallery/Lightbox';
import { useState } from 'react';
import NavbarPage2 from '../components/NavbarPage/NavbarPage2';

const ProjectGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Example project data - Replace these with your actual projects
  const projects = [
    {
      id: 1,
      src: '/images/projects/project1.jpg', // Add your project image in public/images/projects/
      alt: 'E-commerce Website',
      title: 'E-commerce Website',
      description: 'A full-featured e-commerce platform with payment integration',
      projectData: {
        liveWebsite: 'https://your-ecommerce-site.com',
        liveWebsiteRepo: 'https://github.com/yourusername/ecommerce-project',
        technology: 'React, Node.js, MongoDB, Stripe'
      }
    },
    {
      id: 2,
      src: '/images/projects/project2.jpg',
      alt: 'Task Management App',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      projectData: {
        liveWebsite: 'https://your-task-app.com',
        liveWebsiteRepo: 'https://github.com/yourusername/task-app',
        technology: 'React, Firebase, Material-UI'
      }
    },
    // Add more projects following the same structure
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>

      {/* Main Content with padding for fixed navbar */}
      <div className="container mx-auto px-4 py-8 mt-14">
        <h1 className="text-4xl font-bold text-center mb-8">Project Gallery</h1>
        
        {/* Instructions Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Use This Gallery</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">1. Adding Project Images</h3>
              <p className="text-gray-600 dark:text-gray-300">
                - Place your project screenshots in the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">public/images/projects/</code> folder
                - Use high-quality images (recommended size: 1200x900 pixels)
                - Name your images descriptively (e.g., project1.jpg, project2.jpg)
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">2. Project Information</h3>
              <p className="text-gray-600 dark:text-gray-300">
                For each project, provide:
                - Title: Your project name
                - Description: Brief overview of the project
                - Live Website URL: Where users can see the project
                - GitHub Repository: Link to your source code
                - Technology Stack: List of technologies used
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">3. Interacting with Projects</h3>
              <p className="text-gray-600 dark:text-gray-300">
                - Click on any project to view it in full size
                - Hover over projects to see details
                - Click the "Live Website" link to visit the project
                - Click the GitHub icon to view the source code
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <GalleryGrid 
          images={projects} 
          onImageClick={setSelectedImage}
        />

        {/* Lightbox */}
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectGallery; 