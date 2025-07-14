import React from 'react';
import Slider from 'react-slick';

const SlickExample = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <img src={`/images/img${i}.jpg`} alt={`Image ${i}`} style={{ height: '300px', width: '100%' }} />
        </div>
      ))}
    </Slider>
  );
};

export default SlickExample;
