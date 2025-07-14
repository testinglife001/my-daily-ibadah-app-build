import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedPostSlider.css";

const featuredPosts = [
  {
    id: 1,
    title: "Featured Post One",
    date: "April 20, 2025",
    image: "https://picsum.photos/id/1018/1200/600",
    excerpt: "This is a preview of the featured post one.",
    link: "#",
  },
  {
    id: 2,
    title: "Featured Post Two",
    date: "April 15, 2025",
    image: "https://picsum.photos/id/1023/1200/600",
    excerpt: "This is a preview of the featured post two.",
    link: "#",
  },
  {
    id: 3,
    title: "Featured Post Three",
    date: "April 10, 2025",
    image: "https://picsum.photos/id/1031/1200/600",
    excerpt: "This is a preview of the featured post three.",
    link: "#",
  },
];

export default function FeaturedPostSlider() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className="featured-post-slider container-fluid px-0 mb-5">
      <h2 className="mb-4 px-3">Featured Posts</h2>

      {/* Main Slider */}
      <Swiper
        style={{
          "--swiper-navigation-color": "#712cf9",
          "--swiper-pagination-color": "#712cf9",
        }}
        spaceBetween={10}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs, Navigation, Pagination, Autoplay]}
        className="mb-3 main-swiper"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="featured-slide">
              <img
                src={post.image}
                alt={post.title}
                className="featured-img"
              />
              <div className="featured-caption text-white px-4 py-3">
                <h3 className="fw-bold">{post.title}</h3>
                <small>{post.date}</small>
                <p>{post.excerpt}</p>
                <a href={post.link} className="text-white fw-semibold">
                  Continue reading &raquo;
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Thumbs]}
        className="featured-thumbs px-3"
        breakpoints={{
          0: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
        }}
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={`thumb-${post.id}`} style={{ cursor: "pointer" }}>
            <img
              src={post.image}
              alt={`Thumb for ${post.title}`}
              className="thumb-img  rounded"
              style={{width:'200px'}}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
