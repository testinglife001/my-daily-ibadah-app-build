// SlickCarousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SlickCarouselDemo = () => {
  const data = [
    {
      id: 1,
      title: 'Nature View',
      image: 'https://via.placeholder.com/400x250?text=Nature',
    },
    {
      id: 2,
      title: 'Mountain Peak',
      image: 'https://via.placeholder.com/400x250?text=Mountain',
    },
    {
      id: 3,
      title: 'City Night',
      image: 'https://via.placeholder.com/400x250?text=City',
    },
    {
      id: 4,
      title: 'Calm Beach',
      image: 'https://via.placeholder.com/400x250?text=Beach',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">React Slick Carousel</h3>
      <Slider {...settings}>
        {data.map((item) => (
          <div key={item.id} className="text-center px-2">
            <img src={item.image} alt={item.title} className="img-fluid rounded" />
            <h5 className="mt-2">{item.title}</h5>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlickCarouselDemo;
