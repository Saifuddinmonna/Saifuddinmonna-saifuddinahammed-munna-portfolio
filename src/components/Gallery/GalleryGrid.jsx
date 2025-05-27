import React, { useState } from 'react';
import GalleryItem from './GalleryItem';
import Lightbox from './Lightbox';

const GalleryGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <GalleryItem
            key={index}
            image={image}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
};

export default GalleryGrid; 