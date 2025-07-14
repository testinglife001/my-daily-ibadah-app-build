// src/components/HeroSlider.jsx
import React from "react";
import HeroWithVerticalSlider from "./HeroWithVerticalSlider";

export default function HeroSlider() {
  return (
    <section
      className="bg-dark text-white d-flex align-items-center justify-content-center"
      style={{ height: "400px" }}
    >

        <HeroWithVerticalSlider/>

    </section>
  );
}
