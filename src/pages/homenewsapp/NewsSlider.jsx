import { Carousel } from 'react-bootstrap';

const NewsSlider = () => (
  <Carousel>
    {["slider1.jpg", "slider2.jpg", "slider3.jpg"].map((img, idx) => (
      <Carousel.Item key={idx}>
        <img className="d-block w-100" src={`/${img}`} alt={`slide ${idx}`} />
        <Carousel.Caption>
          <h3>Headline {idx + 1}</h3>
          <p>Brief description for slide {idx + 1}</p>
        </Carousel.Caption>
      </Carousel.Item>
    ))}
  </Carousel>
);

export default NewsSlider;
