import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const SwiperCarouselVerticalDemo = () => {
  return (
    <div className="my-4" style={{ height: '600px' }}>
      <Swiper
        direction="vertical"
        modules={[Navigation, Pagination, Autoplay, Mousewheel]}
        spaceBetween={20}
        slidesPerView={1}
        mousewheel
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        style={{ height: '100%' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              style={{
                textAlign: 'center',
                background: '#f8f9fa',
                borderRadius: '10px',
                padding: '10px',
                height: '100%',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <h5 style={{ marginTop: '10px' }}>{slide.title}</h5>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperCarouselVerticalDemo;
