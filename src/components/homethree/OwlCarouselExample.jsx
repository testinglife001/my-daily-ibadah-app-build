import React from 'react';
// import OwlCarousel from 'react-owl-carousel2';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const OwlCarouselExample = () => {
  const options = {
    items: 1,
    loop: true,
    autoplay: true,
    nav: true,
    dots: true,
    margin: 10,
    responsive: {
      1100: { items: 4 },
      724: { items: 2 },
      500: { items: 1 },
    },
  };

  return (
    <OwlCarousel options={options}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="item">
          <img src={`/images/img${i}.jpg`} alt={`Image ${i}`} style={{ height: '300px', width: '100%' }} />
        </div>
      ))}
    </OwlCarousel>
  );
};

export default OwlCarouselExample;
