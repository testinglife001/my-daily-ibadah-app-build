import React, { useEffect, useState, Suspense } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const OwlCarousel = React.lazy(() => import('react-owl-carousel'));

const OwlCarouselWithTitle = () => {
  const [show, setShow] = useState(false);

  const items = [
    { title: 'Nature', image: 'https://via.placeholder.com/400x250?text=Nature' },
    { title: 'Ocean', image: 'https://via.placeholder.com/400x250?text=Ocean' },
    { title: 'Desert', image: 'https://via.placeholder.com/400x250?text=Desert' },
  ];

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <>
      {show && (
        <Suspense fallback={<div>Loading...</div>}>
          <OwlCarousel className="owl-theme" loop margin={10} items={1} autoplay nav>
            {items.map((item, i) => (
              <div key={i} className="text-center">
                <img src={item.image} alt={item.title} className="img-fluid" />
                <h5 className="mt-2">{item.title}</h5>
              </div>
            ))}
          </OwlCarousel>
        </Suspense>
      )}
    </>
  );
};

export default OwlCarouselWithTitle;
