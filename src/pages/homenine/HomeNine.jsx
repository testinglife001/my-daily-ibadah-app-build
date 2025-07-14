import React from 'react'
import SlickSliderRough from '../../components/homenine/SlickSliderRough'
import ImageSlider from '../../components/homenine/ImageSlider'
import ImageSliderUI from '../../components/homenine/ImageSliderUI'
import ImageSliderAuto from '../../components/homenine/ImageSliderAuto'


const HomeNine = () => {
  return (
    <div>
      <br/><hr/><br/>
      <h3>Slick Slider</h3>
      <SlickSliderRough />
      <br/><hr/><br/>
      <h3>Image Slider</h3>
      <ImageSlider />
      <br/><hr/><br/>
      <h3>Lightbox Image Slider UI</h3>
      <ImageSliderUI />
      <br/><hr/><br/>
      <h3>Auto Image Slider</h3>
      <ImageSliderAuto />
      <br/><hr/><br/>
    </div>
  )
}

export default HomeNine