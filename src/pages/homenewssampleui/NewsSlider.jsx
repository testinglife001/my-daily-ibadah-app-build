import { Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const sliderItems = [
  {
    title: 'Elections 2025: Major Parties Prepare',
    image: '/slider1.jpg',
    caption: 'Political landscape heats up across the country.',
  },
  {
    title: 'Mars Colony Mission Progress',
    image: '/slider2.jpg',
    caption: 'SpaceX announces next phase of exploration.',
  },
  {
    title: 'Stock Market Sees Tech Boom',
    image: '/slider3.jpg',
    caption: 'NASDAQ hits all-time high on AI hype.',
  },
];

const NewsSlider = () => {
  const [index, setIndex] = useState(0);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel activeIndex={index} onSelect={(selected) => setIndex(selected)} fade controls={false} indicators>
      {sliderItems.map((item, idx) => (
        <Carousel.Item key={idx}>
          <img
            className="d-block w-100"
            src={item.image}
            alt={item.title}
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
            <h5>{item.title}</h5>
            <p>{item.caption}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default NewsSlider;
