import React from 'react'
import Card from './Card'
import bgVideo from "../assets/Video Backgrounds/earth1.mp4"

function Weather() {
  return (
    <>
    <div className="w-full h-screen items-center flex justify-center object-cover bg-no-repeat"
    >
      <video src={bgVideo}
       autoPlay
       loop
       muted
       className='w-full h-full top-0 left-0 absolute object-cover'
      />
    <Card />
    </div>
  
    </>
  )
}

export default Weather