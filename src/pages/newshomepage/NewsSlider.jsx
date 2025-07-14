import React from 'react';
import { Carousel, Container } from 'react-bootstrap';

const headlines = [
  { title: "Historic Climate Agreement Signed", image: "/images/news1.jpg" },
  { title: "Tech Giants Merge to Form New Empire", image: "/images/news2.jpg" },
  { title: "AI Regulation Act Passed Globally", image: "/images/news3.jpg" }
];

const NewsSlider = () => (
  <Container className="my-4">
    <Carousel fade controls={false} indicators={false} interval={3000} pause={false}>
      {headlines.map((slide, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={slide.image} alt={slide.title} />
          <Carousel.Caption className="bg-dark bg-opacity-50">
            <h5>{slide.title}</h5>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  </Container>
);

export default NewsSlider;
