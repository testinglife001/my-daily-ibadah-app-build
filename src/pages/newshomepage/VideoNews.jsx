import React from 'react';

const videoUrls = [
  'https://www.youtube.com/embed/ysz5S6PUM-U',
  'https://player.vimeo.com/video/76979871'
];

const VideoNews = () => {
  return (
    <div className="video-news">
      {videoUrls.map((url, index) => (
        <div className="ratio ratio-16x9 mb-3" key={index}>
          <iframe src={url} title={`video-${index}`} allow="autoplay; fullscreen" allowFullScreen></iframe>
        </div>
      ))}
    </div>
  );
};

export default VideoNews;
