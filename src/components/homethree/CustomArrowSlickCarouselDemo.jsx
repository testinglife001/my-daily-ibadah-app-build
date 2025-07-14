import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CustomArrowSlickCarouselDemo.css';


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


const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>›</div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>‹</div>
);

const CustomArrowSlickCarouselDemo = () => {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const [lightbox, setLightbox] = useState({ open: false, image: '', title: '' });

  const openLightbox = (image, title) => {
    setLightbox({ open: true, image, title });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, image: '', title: '' });
  };

  const settingsMain = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: true,
    fade: false,
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
    vertical: false,
    arrows: false,
    centerMode: true,
    centerPadding: '0px',
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">✨ Enhanced Slick Carousel</h3>

      {/* Main Image Carousel */}
      <Slider {...settingsMain} className="mb-3">
        {images.map((item) => (
          <div
            key={item.id}
            className="carousel-item-wrapper"
            onClick={() => openLightbox(item.image, item.title)}
          >
            <div className="overlay-caption">{item.title}</div>
            <img
              src={item.image}
              alt={item.title}
              className="img-fluid rounded hover-zoom"
            />
          </div>
        ))}
      </Slider>

      {/* Thumbnail Navigation */}
      <Slider {...settingsThumbs} className="thumb-slider">
        {images.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.title} className="img-thumbnail small-thumb" />
          </div>
        ))}
      </Slider>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content">
            <img src={lightbox.image} alt={lightbox.title} />
            <h5 className="text-white mt-2">{lightbox.title}</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomArrowSlickCarouselDemo;
