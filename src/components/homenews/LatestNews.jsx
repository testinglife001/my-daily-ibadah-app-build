import React from 'react';
import Carousel from 'react-multi-carousel';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SimpleNewsCard from './SimpleNewsCard';
// import './HomeNews.css';
import 'react-multi-carousel/lib/styles.css';
import { Col } from 'react-bootstrap';
import CarouselNewsCard from './CarouselNewsCard';


const slides = [
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

const LatestNews = () => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  const ButtonGroup = ({ next, previous }) => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      {/*<Col lg={6}>
        <div style={{ height: 400, background: '#ddd', textAlign: 'center' }}>
          LatestNews placeholder
        </div>
      </Col>*/}
      <div className="section-title position-relative ps-3 fw-bold fs-5 text-dark">
        Latest News
      </div>
      <div className="d-flex align-items-center gap-2">
        <button className="carousel-btn" onClick={previous}  >
          <FaArrowLeft />
        </button>
        <button className="carousel-btn" onClick={next}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="latest-news-carousel-wrapper">
    <div className="d-flex flex-column-reverse gap-3 pe-lg-2">
      <Carousel
        autoPlay
        arrows={false}
        renderButtonGroupOutside
        customButtonGroup={<ButtonGroup />}
        responsive={responsive}
        infinite
        transitionDuration={500}
      >
        {slides.map((slide) => (
          <CarouselNewsCard key={slide.id} item={slide.image} title={slide.title} type="latest" />
        ))}
      </Carousel>
    </div>
    </div>
  );
};

export default LatestNews;
