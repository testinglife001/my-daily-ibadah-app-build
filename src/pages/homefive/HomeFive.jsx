import React from 'react'
import HeroSlider from '../../components/homefive/HeroSlider'
import Slide from '../../components/homefive/Slide'
import Trending from '../../components/homefive/Trending'


const HomeFive = () => {
  return (
    <div>
        <br/><hr/><br/>
        <h3>HeroSlider</h3>
        <br/><hr/><br/>
        <HeroSlider />
        <br/><hr/><br/>
        <h3>Slide</h3>
        <br/><hr/><br/>
        <Slide />
        <br/><hr/><br/>
        <h3>Trending</h3>
        <br/><hr/><br/>
        <Trending />
        <br/><hr/><br/>
    </div>
  )
}

export default HomeFive