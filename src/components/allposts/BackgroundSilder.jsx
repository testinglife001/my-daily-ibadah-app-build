import React, { useEffect, useState } from 'react';
import './BackgroundSilder.css';
import imageSlide from './backgroundsilder-data';

const BackgroundSilder = () => {

  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if(currentState === 1){
        setCurrentState(0)
      }else{
        setCurrentState(currentState + 1)
      }
    }, 2500)
    return () => clearTimeout(timer)
  },[currentState])

  const bgImageStyle = {
    backgroundImage: `url(${imageSlide[currentState]})`,
    backgroundPosition : 'center',
    backgroundSize: 'cover',
    height: '100%'
  }

  const goToNext = (currentState) => {
    setCurrentState(currentState);
  }

  return (
    <div className='container-style' >
        <div style={bgImageStyle} ></div>
        <div className='transparent-background' ></div>
        <div className='description' >
          <div>
            <h1>{imageSlide[currentState]?.title}</h1>
            <p>{imageSlide[currentState]?.body}</p>
          </div>
          <div className='carousel-boullt' >
            {
              imageSlide.map((imageSlide,currentState) => (
                <span key={currentState} onClick={()=>goToNext(currentState)} ></span>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default BackgroundSilder