import React from 'react';
 import OwlCarousel from 'react-owl-carousel';
// import OwlCarousel from 'react-owl-carousel2';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';




const TrendingList = () => {

    const options = {
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        animateOut: 'slideOutUp',
        nav: true,
        dots: true,
        margin: 10,
        responsive: {
            1100: {
                items: 4,
            },
            724: {
                items: 1,
            },
            500: {
                items: 1,
            },
            370: {
                items: 1,
                innerWidth: "100%",
                outerWidth: "100%"
            },

        },
    };

  return (
    <div>
        <OwlCarousel className='owl-theme' // loop margin={10} nav
            {...options}  
         >
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img1.jpg' alt='image 01' /></h4>
            </div>
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img2.jpg' alt='image 02' /></h4>
            </div>
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img3.jpg' alt='image 03' /></h4>
            </div>
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img4.jpg' alt='image 04' /></h4>
            </div>
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img5.jpg' alt='image 05' /></h4>
            </div>
            <div className='item'>
                <h4 style={{height: '300px'}} ><img src='/images/img6.jpg' alt='image 06' /></h4>
            </div>
        </OwlCarousel>
    </div>
  )
}

export default TrendingList