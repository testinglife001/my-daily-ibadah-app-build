// src/components/HeroSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./HeroVideoBackground.css";

const videos = [
  "/videos/maher-zain-rahmatun.mp4",
  "/videos/give-thanks-mj.mp4",
];

export default function HeroVideoBackground() {
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(5); // 0–100%

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videos[currentVideo];
    video.muted = isMuted;
    video.volume = volume / 100;

    if (isPlaying) {
      video
        .play()
        .then(() => {})
        .catch((err) => console.warn("Autoplay blocked", err));
    }

  }, [currentVideo, isPlaying, isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      if (volume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, [volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) setVolume(50); // restore volume if needed
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };



  return (
    <section className="hero-section-container">
      <video
        ref={videoRef}
        className="background-video fade-video"
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={handleVideoEnded}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      <div className="overlay-dark-sides" />

      <div className="hero-centered-content">
        <div className="hero-content-box text-white text-center px-3">
          <h1 className="display-4 fw-bold">Welcome to My Blog</h1>
          <p className="lead">Latest news and stories from around the world</p>
        </div>
      </div>

      <div className="hero-controls">
        <button className="control-btn" onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="control-btn" onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </section>
  );
}
