import React from "react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import GalleryItem from "./GalleryItem";

const GalleryGrid = ({ images, viewMode = "grid-3" }) => {
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
    <PhotoProvider
      maskOpacity={0.8}
      maskClosable={true}
      photoClosable={true}
      bannerVisible={false}
      overlayRender={({ overlay, index }) => (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
          {index + 1} / {images.length}
        </div>
      )}
    >
      <div className="container mx-auto px-4">
        <div className={`grid ${getGridClasses()} gap-6`}>
          {images.map((image, index) => (
            <div key={index} className={getItemClasses()}>
              <GalleryItem image={image} index={index} viewMode={viewMode} />
            </div>
          ))}
        </div>
      </div>
    </PhotoProvider>
  );
};

export default GalleryGrid;
