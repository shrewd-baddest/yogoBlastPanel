import React,{useEffect} from 'react'
import whatsapp from '../Navigation/file_images/icons8-whatsapp-50.png'
import FB from '../Navigation/file_images/icons8-facebook-logo-48.png'
import TK from '../Navigation/file_images/icons8-tiktok-50.png'
import gsap from 'gsap';
import IG from '../Navigation/file_images/icons8-instagram-logo-50.png'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
 gsap.registerPlugin(ScrollTrigger);
const Footer = () => {

 useEffect(
()=>{
gsap.timeline({scrollTrigger:{
  trigger:'.footers',
  start:'top 90%',
  end:'bottom 90%'
}}).fromTo('.h-text',{
    fontSize:4,
duration:2,
ease:'power2.inOut',
  opacity:0,   
} ,
  {
    opacity:1,
    fontSize:16,
  }
).fromTo('.multi-text',{
    fontSize:4,
duration:4,
ease:'power2.inOut',
     opacity:0,
} ,
  {
    opacity:1,
    fontSize:16,
  }
).fromTo('.footer-page',{
    fontSize:4,
    opacity:0,
 
ease:'back.out',
y:200,
     stagger:{
     each:1,
      grid:"auto",
      axis:'x',
      from:'centre',
     }
} ,
  {
    opacity:1,
    fontSize:16,
    y:0,
  }
)
},
[]


 )
  return (
    <div className='footers'>  


    <div className='company_info'>
      <hr/>
      <h4  className='h-text'>YoGo - Online Shopping in Kenya</h4>
      <p className='multi-text'>YoGo is Kenya's local online shopping mall. 
        It was launched in June 2025 with the mission of "Enriching Lives for all the kenyans".
YoGo serves a retail-customer base that continues to grow exponentially, offering products that span
 various categories of yoghurts .<br />
 YoGo continues to expand the mall, with the scope of offerings that will increase in variety, 
  simplicity and convenience.<br/>
<br />
The range of services are designed to ensure optimum levels of convenience and customer satisfaction with the retail process;
 order delivery-tracking, dedicated customer service support and many other premium services. 
 The company is highly customer-centric and are committed towards finding innovative ways of improving the customers'
  shopping experience.</p>
  <hr/>
  </div>
  <div className='help'>
    <section className='footer-page'>
      <h3>shopping guide</h3>
      <ul>
        <li>how to make puchase</li>
        <li>how long does my order arrive?</li>
        <li>forget password?</li>
      </ul>
    </section>

    <section className='footer-page'>
      <h3>Customer Help Center</h3>
      <ul>
        <li>Terms and Conditions</li>
        <li>Account Settings</li>
        <li>FAQ Center</li>
      </ul>
    </section>

    <section className='footer-page'>
      <h3>Business</h3>
      <ul>
        <li>YoGo shop</li>
      </ul>
    </section>
    <section className='footer-page'>
      <h3>YoGo Enreachment</h3>
      <ul>
        <li>Contact Us</li>
        <li>siteMap</li>
      </ul>
    </section>

  </div>
   <div className='foter' style={{'margin':'0px','padding':'1rem'}}>
    stay connected through:
    <a scr=''><img src={whatsapp} alt="" /></a>
    <a scr=''><img src={IG} alt="" /></a>
    <a scr=''><img src={FB} alt="" /></a>
    <a scr=''><img src={TK} alt="" /></a>
   </div>
  
    <p className="text-sm mt-1">&copy; 2025 All rights reserved.</p>

    </div>

   
  )
}

export default Footer
