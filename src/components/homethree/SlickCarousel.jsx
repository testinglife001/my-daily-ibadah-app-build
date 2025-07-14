// SlickCarousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const carouselItems = [
  {
    id: 1,
    title: 'Beautiful Sunrise',
    image: 'https://via.placeholder.com/400x250?text=Sunrise',
  },
  {
    id: 2,
    title: 'Peaceful Forest',
    image: 'https://via.placeholder.com/400x250?text=Forest',
  },
  {
    id: 3,
    title: 'Snowy Mountains',
    image: 'https://via.placeholder.com/400x250?text=Mountains',
  },
  {
    id: 4,
    title: 'City Lights',
    image: 'https://via.placeholder.com/400x250?text=City',
  },
];

const SlickCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Image & Title Carousel</h3>
      <Slider {...settings}>
        {carouselItems.map((item) => (
          <div key={item.id} className="text-center px-2">
            <img src={item.image} alt={item.title} className="img-fluid rounded" />
            <h5 className="mt-2">{item.title}</h5>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlickCarousel;
