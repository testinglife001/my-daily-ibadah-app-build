// components/ThumbSwiper.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { slides } from './data/slides';

export default function ThumbSwiper() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{ width: '100%', height: '300px' }}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img src={slide.image} alt={slide.title} style={{ width: '100%' }} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        style={{ marginTop: '10px' }}
        modules={[FreeMode, Thumbs]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img src={slide.image} alt={slide.title} style={{ width: '100%' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
