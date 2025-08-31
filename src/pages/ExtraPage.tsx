import React, { useState, useEffect } from 'react';

const ExtraPage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/extra/1.png',
    '/extra/2.png',
    '/extra/3.png',
    '/extra/4.png',
    '/extra/5.png',
    '/extra/6.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="extra-page">
      <div className="image-container">
        <img 
          src={images[currentImage]} 
          alt={`Extra image ${currentImage + 1}`}
          className="slideshow-image"
        />
      </div>
    </div>
  );
};

export default ExtraPage;