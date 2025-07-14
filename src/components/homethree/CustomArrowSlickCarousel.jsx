// CustomArrowCarousel.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CustomArrowSlickCarousel.css'; // Optional for extra styles

const images = [
  {
    id: 1,
    title: 'Sunrise Beach',
    image: 'https://cdn.wallpapersafari.com/47/81/GvPV8B.jpg',
  },
  {
    id: 2,
    title: 'Forest Trail',
    image: 'https://images.hdqwalls.com/download/canyonlands-sunrise-4k-dn-1360x768.jpg',
  },
  {
    id: 3,
    title: 'Snowy Mountains',
    image: 'https://thumbs.dreamstime.com/b/nature-thailand-rice-farm-44919269.jpg',
  },
  {
    id: 4,
    title: 'Desert Dunes',
    image: 'https://thumbs.dreamstime.com/b/rice-field-11331615.jpg',
  },
  {
    id: 5,
    title: 'City Nights',
    image: 'https://as1.ftcdn.net/v2/jpg/05/13/62/20/1000_F_513622056_aQR7ZWBkJ4NyzCByAgswMpNF3B6e9UIJ.jpg',
  },
];

const NextArrow = (props) => {
  const { onClick } = props;
  return <div className="custom-arrow next" onClick={onClick}>›</div>;
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return <div className="custom-arrow prev" onClick={onClick}>‹</div>;
};

const CustomArrowSlickCarousel = () => {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  const settingsMain = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: true,
    fade: false, // toggle to true for fade effect
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const settingsThumbs = {
    asNavFor: nav1,
    ref: (slider) => setNav2(slider),
    slidesToShow: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    vertical: false, // set true for vertical thumbs
    arrows: false,
    centerMode: true,
    centerPadding: '0px',
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">React Slick Gallery</h3>

      {/* Main Slider */}
      <Slider {...settingsMain} className="mb-3">
        {images.map((item) => (
          <div key={item.id} className="text-center">
            <img src={item.image} alt={item.title} className="img-fluid rounded" />
            <h5 className="mt-2">{item.title}</h5>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Slider */}
      <Slider {...settingsThumbs} className="thumb-slider">
        {images.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.title} className="img-thumbnail small-thumb" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomArrowSlickCarousel;
