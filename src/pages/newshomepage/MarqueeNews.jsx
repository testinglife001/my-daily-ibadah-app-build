import React from 'react';
import { Container } from 'react-bootstrap';
import './MarqueeNews.css';

const MarqueeNews = () => {
  return (
    <div className="bg-dark text-light py-2 marquee-container">
      <Container>
        <marquee behavior="scroll" direction="left">
          🔴 Breaking: Stock market sees historic surge | 🗳️ Election updates live | 🛰️ NASA launches new satellite | 🏆 UEFA Final this weekend
        </marquee>
      </Container>
    </div>
  );
};

export default MarqueeNews;
