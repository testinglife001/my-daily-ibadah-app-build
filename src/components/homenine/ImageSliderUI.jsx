// components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ImageSliderUI.css';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const imageList = [
  { src: '/images/img1.jpg', title: 'Mountains', description: 'Peaceful mountain view' },
  { src: '/images/img2.jpg', title: 'Ocean', description: 'Waves crashing at dawn' },
  { src: '/images/img3.jpg', title: 'Desert', description: 'Sand dunes at sunset' },
  { src: '/images/img4.jpg', title: 'Forest', description: 'Lush green trees' },
  { src: '/images/img5.jpg', title: 'Cityscape', description: 'Night city skyline' },
  { src: '/images/img6.jpg', title: 'Village', description: 'Quiet countryside' },
];

const ImageSliderUI = () => {
  const [activeImage, setActiveImage] = useState(imageList[0]);
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  const [showModal, setShowModal] = useState(false);
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const toggleFullscreen = () => {
    const el = document.getElementById('fullscreenImage');
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  return (
    <div className="container my-4">
      <h4 className="text-center mb-3">Dynamic Image Gallery with Modal & Fullscreen</h4>

      {/* Large Image Display */}
      <div className="mb-4 text-center position-relative">
        <img
          src={activeImage.src}
          alt="Active"
          className="img-fluid rounded shadow-lg preview-image"
          style={{ maxHeight: '400px', cursor: 'pointer' }}
          onClick={openModal}
        />
        <div className="image-caption bg-dark text-white p-2 mt-2 rounded">
          <h5>{activeImage.title}</h5>
          <p className="mb-0">{activeImage.description}</p>
        </div>
      </div>

      {/* View Switch */}
      <div className="text-end mb-2">
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setViewType('list')}>List View</button>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setViewType('grid')}>Grid View</button>
      </div>

      {/* Thumbnail Scroll */}
      <div
        ref={marqueeRef}
        className={`d-flex ${viewType === 'list' ? 'flex-row overflow-auto' : 'flex-wrap'} slider-thumbnails`}
      >
        {imageList.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={`thumb-${i}`}
            className={`img-thumbnail m-1 thumbnail ${activeImage.src === img.src ? 'active-thumb' : ''} ${viewType === 'grid' ? 'grid-thumb' : ''}`}
            onClick={() => setActiveImage(img)}
          />
        ))}
      </div>

      {/* Modal Lightbox */}
      <Modal show={showModal} onHide={closeModal} centered size="lg" className="image-modal">
        <Modal.Body className="p-0 bg-dark text-white position-relative">
          <img
            src={activeImage.src}
            alt="Full View"
            id="fullscreenImage"
            className="w-100"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />
          <div className="p-3">
            <h5>{activeImage.title}</h5>
            <p>{activeImage.description}</p>
          </div>
          <button
            className="btn btn-light btn-sm position-absolute top-0 end-0 m-2"
            onClick={closeModal}
          >
            ✕
          </button>
          <button
            className="btn btn-outline-light btn-sm position-absolute top-0 start-0 m-2"
            onClick={toggleFullscreen}
          >
            ⛶ Fullscreen
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImageSliderUI;
