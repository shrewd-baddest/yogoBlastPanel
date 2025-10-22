import React,{useEffect} from 'react'
 import yogo from '../images/yogoo.jpg';
 import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
const Welcome = () => {
 const navigate = useNavigate();

  const Anime = () => {
    const tl = gsap.timeline();

    tl.to('.welcome-msg', {
      y: -200,
      opacity: 0,
      duration: 1,
      fontSize: 8,
      ease: 'back.in',
    })
      .to('.site-image', {
        opacity: 0,
        y: -100,
        width: '10%',
        duration: 1,
        ease: 'back.in',
      })
      .to('.Home-button', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'back.in',
      })
      .add(() => {
        navigate('/home');
      }); 
  };

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.welcome-msg',
      { x: -200, opacity: 0, fontSize: 8 },
      { x: 0, opacity: 1, fontSize: 24, duration: 1 }
    )
      .fromTo(
        '.site-image',
        { opacity: 0, y: -100, width: '10%' },
        { opacity: 1, y: 0, width: '30%', duration: 1 }
      )
      .fromTo(
        '.Home-button',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      );

    // Optionally auto-trigger the animation after 4 seconds
    const timeout = setTimeout(Anime, 4000);
    return () => clearTimeout(timeout);
  }, []);


  return (
    <div  className='welcome-page' 
    style={{
      backgroundColor:'rgb(7, 7, 59)',
      height:'100vh',
      marginTop:'0%',
      // paddingTop:'30%',
      
    }}
    >
      <h2 className='welcome-msg'>WELCOME TO YOGO BLAST COMPANY THE HOME OF SWEETNESS</h2>
      <img src={yogo} className='site-image' />
      <button onClick={Anime} className='Home-button'>Go to Home Page</button>
    </div>
  )
}

export default Welcome
