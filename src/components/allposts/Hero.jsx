import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import './styles.css';
// import { Autoplay, Pagination } from 'swiper/modules';




const Hero = () => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 gap-md-5" >
        <div className="w-50 w-md-50 text-center" >
            <h1 className="fw-bold text-3xl text-md-5xl lh-md-tight" >
                About My Daily Deeds App or My Daily Ibadah App
            </h1>
            <p className='py-3' >
                This course offers a complete, in-depth look at modern web development using the MERN stack. 
                By the end, you'll have a fully functional blog website and the skills to build and manage your 
                own web projects. Plus, you'll gain insights into best practices for both frontend and backend 
                development, making you a versatile and valuable developer in today's job market.
            </p>
        </div>
        <div className='w-50 w-md-50 mx-auto' >
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                // pagination={{
                // clickable: true,
                // }}
                autoplay={{
                    delay:1500,
                    disableOnInteraction:false,
                }}
                breakpoints={{
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 50,
                },
                }}
                // modules={[Pagination, Autoplay]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src="/images/img1.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/img2.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/img3.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/img4.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/img5.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/img6.jpg" alt='' className='w-100' style={{height:'20rem'}} />
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
  )
}

export default Hero