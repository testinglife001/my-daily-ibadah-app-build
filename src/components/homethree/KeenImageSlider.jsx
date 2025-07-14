// components/ImageSlider.jsx
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './KeenImageSlider.css';

const images = [
  { id: 1, title: "Sunset", image: "https://via.placeholder.com/600x300?text=Sunset" },
  { id: 2, title: "Forest", image: "https://via.placeholder.com/600x300?text=Forest" },
  { id: 3, title: "Ocean", image: "https://via.placeholder.com/600x300?text=Ocean" },
  { id: 4, title: "Mountains", image: "https://via.placeholder.com/600x300?text=Mountains" },
];

export default function KeenImageSlider() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
  });

  return (
    <div className="navigation-wrapper">
      <div ref={sliderRef} className="keen-slider">
        {images.map((img) => (
          <div key={img.id} className="keen-slider__slide number-slide">
            <img src={img.image} alt={img.title} />
            <h4>{img.title}</h4>
          </div>
        ))}
      </div>

      {/* Optional navigation */}
      <div className="dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
          >
            ●
          </button>
        ))}
      </div>
    </div>
  );
}
