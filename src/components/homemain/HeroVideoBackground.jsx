import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import "./HeroVideoBackground.css";

const playlist = [
  {
    src: "/videos/maher-zain-rahmatun.mp4",
    title: "Rahmatun Lil'Alameen",
    subtitle: "Start your day with reflection and gratitude",
  },
  {
    src: "/videos/give-thanks-mj.mp4",
    title: "Give Thanks",
    subtitle: "Positive reminders and meaningful stories",
  },
];

export default function HeroVideoBackground() {
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  const activeVideo = useMemo(() => playlist[currentVideo], [currentVideo]);

  const ensurePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = volume / 100;

    if (!isPlaying) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch (err) {
      // Browser autoplay policy can block when sound is enabled.
      video.muted = true;
      setIsMuted(true);
      try {
        await video.play();
      } catch (playErr) {
        console.warn("Autoplay blocked:", playErr);
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    ensurePlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo, isMuted, isPlaying, volume]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Play blocked:", err);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && volume === 0) {
      setVolume(40);
      video.volume = 0.4;
    }

    video.muted = nextMuted;
  };

  const handleVolumeChange = (e) => {
    const nextVolume = Number(e.target.value);
    setVolume(nextVolume);

    const video = videoRef.current;
    if (!video) return;

    video.volume = nextVolume / 100;
    const shouldMute = nextVolume === 0;
    video.muted = shouldMute;
    setIsMuted(shouldMute);
  };

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % playlist.length);
  };

  const handleLoadedData = () => {
    ensurePlayback();
  };

  return (
    <section className="hero-section-container">
      <video
        key={activeVideo.src}
        ref={videoRef}
        className="background-video"
        autoPlay
        playsInline
        muted={isMuted}
        preload="auto"
        onLoadedData={handleLoadedData}
        onEnded={handleVideoEnded}
      >
        <source src={activeVideo.src} type="video/mp4" />
      </video>

      <div className="overlay-dark-sides" />

      <div className="hero-centered-content">
        <div className="hero-content-box text-white text-center px-3">
          <span className="hero-kicker">Main Home Experience</span>
          <h1 className="display-5 fw-bold mb-2">{activeVideo.title}</h1>
          <p className="lead mb-1">{activeVideo.subtitle}</p>
          <p className="hero-subtitle mb-0">Two videos now play back-to-back automatically.</p>
        </div>
      </div>

      <div className="hero-controls" aria-label="Hero video controls">
        <button className="control-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause video" : "Play video"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="control-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Video volume"
        />
      </div>

      <div className="hero-pagination" aria-label="Video sequence indicator">
        {playlist.map((video, index) => (
          <button
            key={video.src}
            type="button"
            className={`hero-dot ${index === currentVideo ? "active" : ""}`}
            onClick={() => setCurrentVideo(index)}
            aria-label={`Play clip ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
