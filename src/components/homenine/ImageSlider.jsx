// components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ImageSlider.css';

const imageList = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
];

const ImageSlider = () => {
  const [activeImage, setActiveImage] = useState(imageList[0]);
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  const marqueeRef = useRef(null);

  // Auto-scroll marquee
  useEffect(() => {
    const marquee = marqueeRef.current;
    let scrollAmount = 0;

    const scroll = () => {
      if (marquee) {
        marquee.scrollLeft += 1;
        scrollAmount++;
        if (scrollAmount >= marquee.scrollWidth - marquee.clientWidth) {
          marquee.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    };

    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container my-4">
      <h4 className="text-center mb-3">Dynamic Image Gallery with Marquee</h4>

      {/* Active Image */}
      <div className="mb-4 text-center">
        <img
          src={activeImage}
          alt="Active"
          className="img-fluid rounded shadow"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      </div>

      {/* View Toggle */}
      <div className="text-end mb-2">
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => setViewType('list')}
        >
          List View
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setViewType('grid')}
        >
          Grid View
        </button>
      </div>

      {/* Thumbnails */}
      <div
        ref={marqueeRef}
        className={`d-flex ${viewType === 'list' ? 'flex-row overflow-auto' : 'flex-wrap'} slider-thumbnails`}
      >
        {imageList.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            className={`img-thumbnail m-1 thumbnail ${activeImage === img ? 'active-thumb' : ''} ${
              viewType === 'grid' ? 'grid-thumb' : ''
            }`}
            onClick={() => setActiveImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
