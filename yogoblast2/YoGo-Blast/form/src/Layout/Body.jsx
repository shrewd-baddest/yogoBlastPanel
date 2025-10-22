import React, { useEffect } from 'react'
import img from '../images/pexels.jpg'
import  '../Body.css';
import { Outlet } from 'react-router-dom';
const Body = () => {
  const bgStyle = {
  backgroundImage: `url(${img})`,
backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    marginTop:'0px',
  };

  return (
    <div style={bgStyle}>

     <Outlet />
    
    </div>
  )
}

export default Body
