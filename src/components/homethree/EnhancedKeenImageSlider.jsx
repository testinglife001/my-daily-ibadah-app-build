// components/EnhancedImageSlider.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './EnhancedKeenImageSlider.css';

const images = [
  { id: 1, title: 'Sunset', image: 'https://via.placeholder.com/600x300?text=Sunset' },
  { id: 2, title: 'Forest', image: 'https://via.placeholder.com/600x300?text=Forest' },
  { id: 3, title: 'Ocean', image: 'https://via.placeholder.com/600x300?text=Ocean' },
  { id: 4, title: 'Mountains', image: 'https://via.placeholder.com/600x300?text=Mountains' },
  { id: 5, title: 'City', image: 'https://via.placeholder.com/600x300?text=City' },
];

export default function EnhancedKeenImageSlider() {
  const timer = useRef();
  const [pause, setPause] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 15,
        breakpoints: {
          '(min-width: 640px)': { perView: 2 },
          '(min-width: 1024px)': { perView: 3 },
        },
      },
    },
    [
      (slider) => {
        let timeout;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (!pause) {
            timeout = setTimeout(() => {
              slider.next();
            }, 3000);
          }
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => setPause(true));
          slider.container.addEventListener('mouseout', () => setPause(false));
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );

  return (
    <div className="navigation-wrapper">
      <div ref={sliderRef} className="keen-slider">
        {images.map((img) => (
          <div key={img.id} className="keen-slider__slide number-slide">
            <img src={img.image} alt={img.title} />
            <h5>{img.title}</h5>
          </div>
        ))}
      </div>

      <div className="arrows">
        <button onClick={() => instanceRef.current?.prev()} className="arrow left">
          ◀
        </button>
        <button onClick={() => instanceRef.current?.next()} className="arrow right">
          ▶
        </button>
      </div>
    </div>
  );
}
