import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperExample = () => {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      breakpoints={{
        500: { slidesPerView: 1 },
        724: { slidesPerView: 2 },
        1100: { slidesPerView: 4 },
      }}
    >
      {[1, 2, 3, 4].map(i => (
        <SwiperSlide key={i}>
          <img src={`/images/img${i}.jpg`} alt={`Image ${i}`} style={{ height: '300px', width: '100%' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperExample;

