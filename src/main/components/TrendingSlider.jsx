import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./TrendingSlider.css";

const trendingPosts = [
  {
    id: 1,
    title: "React 19 is Here: What's New?",
    date: "June 25, 2025",
    image: "https://via.placeholder.com/200x120",
  },
  {
    id: 2,
    title: "CSS Grid vs Flexbox: When to Use What",
    date: "June 24, 2025",
    image: "https://via.placeholder.com/200x120",
  },
  {
    id: 3,
    title: "AI Tools That Boost Developer Productivity",
    date: "June 23, 2025",
    image: "https://via.placeholder.com/200x120",
  },
  {
    id: 4,
    title: "Server Components: React’s New Paradigm",
    date: "June 22, 2025",
    image: "https://via.placeholder.com/200x120",
  },
  {
    id: 5,
    title: "10 VSCode Extensions You Must Try",
    date: "June 21, 2025",
    image: "https://via.placeholder.com/200x120",
  },
  {
    id: 6,
    title: "Web Performance Optimization Tips",
    date: "June 20, 2025",
    image: "https://via.placeholder.com/200x120",
  },
];

export default function TrendingSlider() {
  return (
    <section className="my-4 trending-slider">
      <h5 className="fw-bold mb-3 px-2">🔥 Trending Posts</h5>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={3000}
        breakpoints={{
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
        }}
        className="px-2"
      >
        {trendingPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="card h-100 border-0 shadow-sm">
              <img
                src={post.image}
                className="card-img-top"
                alt={post.title}
                style={{ height: "120px", objectFit: "cover" }}
              />
              <div className="card-body p-2">
                <h6 className="card-title mb-1" style={{ fontSize: "0.9rem" }}>
                  {post.title}
                </h6>
                <small className="text-muted">{post.date}</small>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
