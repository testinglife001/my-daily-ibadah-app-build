// components/LoopSwiper.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { slides } from './data/slides';

export default function LoopSwiper() {
  return (
    <Swiper
      loop
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 2000 }}
      modules={[Navigation, Pagination, Autoplay]}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <img src={slide.image} alt={slide.title} style={{ width: '100%' }} />
          <h5 style={{ textAlign: 'center' }}>{slide.title}</h5>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
