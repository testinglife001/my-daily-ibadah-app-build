// src/components/HeroSection.jsx
import React from "react";

export default function HeroSection() {
  return (
    <section
      className="bg-dark text-white d-flex align-items-center justify-content-center"
      style={{ height: "400px" }}
    >
      <div className="text-center px-3">
        <h1 className="display-4 fw-bold">Welcome to My Blog</h1>
        <p className="lead">Latest news and stories from around the world</p>
      </div>
    </section>
  );
}
