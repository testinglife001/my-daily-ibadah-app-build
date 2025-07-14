import React from 'react'
import OwlCarouselExample from '../../components/homethree/OwlCarouselExample'
import SlickExample from '../../components/homethree/SlickExample'
import SwiperExample from '../../components/homethree/SwiperExample'
import KeenSliderExample from '../../components/homethree/KeenSliderExample'
import SwiperCarousel from '../../components/homethree/SwiperCarousel'
import CustomArrowSlickCarousel from '../../components/homethree/CustomArrowSlickCarousel'
import CustomArrowSlickCarouselDemo from '../../components/homethree/CustomArrowSlickCarouselDemo'
import KeenImageSlider from '../../components/homethree/KeenImageSlider'
import EnhancedKeenImageSlider from '../../components/homethree/EnhancedKeenImageSlider'
import OwlCarouselWithTitle from '../../components/homethree/OwlCarouselWithTitle'
import SlickCarousel from '../../components/homethree/SlickCarousel'
import SwiperCarouselDemo from '../../components/homethree/SwiperCarouselDemo'
import SlickCarouselDemo from '../../components/homethree/SlickCarouselDemo'
import HorizontalSwiper from '../../components/homethree/HorizontalSwiper'
import VerticalSwiper from '../../components/homethree/VerticalSwiper'
import LoopSwiper from '../../components/homethree/LoopSwiper'
import ThumbSwiper from '../../components/homethree/ThumbSwiper'
import VerticalSwiperDemo from '../../components/homethree/VerticalSwiperDemo'


const HomeThree = () => {
  return (
    <div>
      <h3>OwlCarouselExample</h3> - could not run 
      <br/><hr/><br/>
      <OwlCarouselExample />
      <br/><hr/><br/>
      <h3>Slick Example</h3>
      <br/><hr/><br/>
      <SlickExample />
      <br/><hr/><br/>
      <h3>Swiper Example</h3> - does not work
      <br/><hr/><br/>
      <SwiperExample />
      <br/><hr/><br/>
      <h3>Keen Slider Example</h3>
      <br/><hr/><br/>
      <KeenSliderExample />
      <br/><hr/><br/>
      <h2 className="text-center">Swiper v11 Carousel</h2>
      <SwiperCarousel />
      <br/><hr/><br/>
      <h3>Custom Arrow Slick Carousel</h3>
      <br/>
      <CustomArrowSlickCarousel />
      <br/><hr/><br/>
      <h3>Custom Arrow Slick CarouselDemo</h3>
      <br/>
      <CustomArrowSlickCarouselDemo />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>KeenImageSlider</h3>
      <br/>
      <KeenImageSlider />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>Enhanced Keen Image Slider</h3>
      <br/>
      <EnhancedKeenImageSlider />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>OwlCarousel With Title</h3>
      <br/>
      <OwlCarouselWithTitle/>
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>Slick Carousel</h3>
      <br/>
      <SlickCarousel />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>Slick Carousel Demo</h3>
      <br/>
      <SlickCarouselDemo />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>Swiper Carousel Demo</h3>
      <br/>
      <SwiperCarouselDemo />
      <br/><hr/><br/>
      <br/><hr/><br/>
      <h3>SlickCarouselDemo</h3>
      <br/>
      <SlickCarouselDemo />
      <br/><hr/><br/>
      <div className="container my-4">
        <h2>1️⃣ Horizontal Swiper</h2>
        <HorizontalSwiper />
        <h2 className="mt-5">2️⃣ Vertical Swiper</h2>
        <VerticalSwiper />
        <h2 className="mt-5">3️⃣ Loop Swiper</h2>
        <LoopSwiper />
        <h2 className="mt-5">4️⃣ Thumbnails Swiper</h2>
        <ThumbSwiper />
        
      </div>
      
     <div className="container-fluid my-4">
        <h3>VerticalSwiper</h3>
       < VerticalSwiperDemo />
      </div>
      
    </div>
  )
}

export default HomeThree