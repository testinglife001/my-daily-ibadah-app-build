import React, { useState } from "react";
import "./SlickSliderRough.css";
import Slider from "react-slick";

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// const images = [astronaut, celebrating, education, taken];
const images = ['/images/a.png', '/images/b.png', '/images/c.png', '/images/d.png'];

function SlickSliderRough() {
  const NextArrow = ({ onClick }) => {
    return (
      <div className="arrow next" onClick={onClick}>
        <FaArrowRight />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="arrow prev" onClick={onClick}>
        <FaArrowLeft />
      </div>
    );
  };

  const [imageIndex, setImageIndex] = useState(0);

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  return (
    <div className="SlickSlider">
      <Slider {...settings}>
         {images.map((img, idx) => ( 
        /*{[a, b, c, d].map((i,idx) => ( */
          <div className={idx === imageIndex ? "slide activeSlide" : "slide"}>
            <img src={img} alt={img} />
            {/*<img
              src={`/images/${i}.png`}
              alt={`Slide ${i}`}
              // style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />*/}
          </div>
        ))}
      </Slider>

    </div>
  );
}

export default SlickSliderRough;