// components/SwiperCarousel.jsx
import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
 import { Navigation, Pagination, Autoplay } from 'swiper/modules';
 import 'swiper/css';
 import 'swiper/css/navigation';
 import 'swiper/css/pagination';
import './SwiperCarousel.css';

const SwiperCarousel = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Swiper
        // modules={[Navigation, Pagination, Autoplay]}
        // modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={10}
        // navigation
        // pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          500: {
            slidesPerView: 1,
          },
          724: {
            slidesPerView: 2,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
      >
        {[1, 2, 3, 4, 2, 6].map((i) => (
          <SwiperSlide key={i}>
            <img
              src={`/images/img${i}.jpg`}
              alt={`Slide ${i}`}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperCarousel;
