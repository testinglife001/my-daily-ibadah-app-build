// src/components/MarqueeBar.jsx
import React from "react";
import Marquee from "react-fast-marquee";

const breakingNews = [
  "Breaking: React 19 announced with amazing features!",
  "Update: Bootstrap 6 is now in alpha testing.",
  "News: Web accessibility guidelines updated for 2025.",
  "Hot: New CSS properties to simplify layouts.",
];

export default function MarqueeBar() {
  return (
    <div className="bg-primary text-white py-2">
      <Marquee pauseOnHover={true} gradient={false} speed={50}>
        {breakingNews.map((news, index) => (
          <span key={index} className="mx-4">
            {news}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
