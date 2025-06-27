import React, { useState } from "react";
import GalleryItem from "./GalleryItem";
import Lightbox from "./Lightbox";

const GalleryGrid = ({ images, viewMode = "grid-3" }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = image => {
    setSelectedImage(image);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  // Get grid classes based on view mode
  const getGridClasses = () => {
    switch (viewMode) {
      case "grid-1":
        return "grid-cols-1";
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Get item classes based on view mode
  const getItemClasses = () => {
    if (viewMode === "list") {
      return "flex flex-col md:flex-row gap-4 p-4 bg-[var(--background-elevated)] rounded-lg border border-[var(--border-color)] hover:shadow-lg transition-all duration-300";
    }
    return "";
  };

  return (
    <div className="container mx-auto px-4">
      <div className={`grid ${getGridClasses()} gap-6`}>
        {images.map((image, index) => (
          <div key={index} className={getItemClasses()}>
            <GalleryItem
              image={image}
              onClick={() => handleImageClick(image)}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>
      {selectedImage && <Lightbox image={selectedImage} onClose={handleCloseLightbox} />}
    </div>
  );
};

export default GalleryGrid;
