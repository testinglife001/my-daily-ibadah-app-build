// components/VerticalSwiper.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { slides } from './data/slides';

export default function VerticalSwiper() {
  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      spaceBetween={30}
      mousewheel
      pagination={{ clickable: true }}
      modules={[Pagination, Mousewheel]}
      style={{ height: '300px' }}
    >
      {[1, 2, 3, 4, 2, 6].map((i) => (
        <SwiperSlide key={i}>
          <img src={`/images/img${i}.jpg`} alt={`Slide ${i}`} style={{ width: '100%' }} />
          <h5 style={{ textAlign: 'center' }}>{i}</h5>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
