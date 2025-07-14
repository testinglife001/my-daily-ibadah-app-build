// src/MainApp.jsx
import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MarqueeBar from "./components/MarqueeBar";
import FeaturedPostSlider from "./components/FeaturedPostSlider";
import TwoSidePosts from "./components/TwoSidePosts";
import BlogPostsList from "./components/BlogPostsList";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import TrendingSlider from "./components/TrendingSlider";
import Topbar from "../components/home/topbar/Topbar";
import SidebarAlt from "../pages/home/SidebarAlt";

// We'll add more components later, like FeaturedPostSlider

export default function MainApp() {
  return (
    <div className="bg-light text-dark">
      {/* <Header /> */}
      <Topbar />
      <MarqueeBar />
      <HeroSection />

      <div className="container-fluid my-4">
            <FeaturedPostSlider />
            <TwoSidePosts />
            <TrendingSlider />

        <div className="row mt-4">
            <div className="col-md-8">
                <BlogPostsList />
            </div>
            <div className="col-md-4">
              {/*  <Sidebar /> */}
              <Sidebar />
            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
