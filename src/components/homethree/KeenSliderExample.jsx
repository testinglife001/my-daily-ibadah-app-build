import React from 'react';
import { useKeenSlider } from 'keen-slider/react';

const KeenSliderExample = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
    breakpoints: {
      '(min-width: 724px)': {
        slides: { perView: 2, spacing: 15 },
      },
      '(min-width: 1100px)': {
        slides: { perView: 4, spacing: 20 },
      },
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="keen-slider__slide">
          <img src={`/images/img${i}.jpg`} alt={`Image ${i}`} style={{ height: '300px', width: '100%' }} />
        </div>
      ))}
    </div>
  );
};

export default KeenSliderExample;
