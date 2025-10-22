import React, { useEffect, useRef, useState } from 'react';
import three from '../images/cld-sample-4.jpg';
import four from '../images/joanna-stolowicz-kIAn3h1pSAc-unsplash.jpg';
import five from '../images/yogo.jpg';
import {Link,  useLoaderData } from 'react-router-dom';
import gsap  from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
 gsap.registerPlugin(ScrollTrigger);

const Home = () => {
 const  hove=useRef(null);
const  lt=useRef(null);
const gt=useRef(null);
const choices=useLoaderData();
console.log(choices);
const newImages = choices?.[0] || [];
const imagesLike = choices?.[1] || [];
 
console.log(imagesLike);
  const images = [three, four, five]; // All slideshow images
  const [current, setCurrent] = useState(0); // Current image index
  const [autoSlide, setAutoSlide] = useState(true); // Auto play on/off
 var prev=0;
  // Auto-slide every 3 seconds
  useEffect(
()=>{
 gsap.fromTo('.gsap-new',{
  opacity:0,
   fontSize:8,
 },{
  opacity:1,
  fontSize:16,
  duration:1,
})

gsap.timeline({scrollTrigger:{
  trigger:'.newImage',
  start:'top 90%',
  end:'bottom 90%'
}}).fromTo('.newImage',{
    y:-100,
opacity:0,
ease:'bounce',
    stagger:{
       amount:1.5,
        grid:'auto',
        axis:'y',
        from:'end',  
    }
} ,
  {
    opacity:1,
    y:0,
  }
);
},

[]
  )
  useEffect(() => {
    if (!autoSlide) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoSlide]);
 
  // Show previous image
  const showPrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Show next image
  const showNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  // Toggle auto slide on image click
  const toggleAutoSlide = () => {
    setAutoSlide((prev) => !prev);
  };
function opac(){
  lt.current.style.opacity='0.6'
gt.current.style.opacity='0.6'
hove.current.style.cursor='pointer'

}
function transp(){
  lt.current.style.opacity='0'
gt.current.style.opacity='0'

}
useEffect(() => {
  if (!hove.current) return;

  const el = hove.current;

  el.addEventListener('mouseout', transp);
  el.addEventListener('mouseover', opac);
  lt.current.addEventListener('mouseover', opac);
  gt.current.addEventListener('mouseover', opac);
  return () => {
    if (el) {
      el.removeEventListener('mouseover', opac);
      el.removeEventListener('mouseout', transp);
    }
  };
}, []);

 
   return (
    <div style={{ paddingLeft: '8%', paddingRight: '8%' }}>
      <div className='grp'>
            {/* Category Section */}
        <section className="catalog">
          <h3>Category <span>🔻</span></h3>
          <ul className="categories">
            {[
              'Fresha', 'BrookSide', 'Tuzo', 'Mala',
              'Fresh', 'delamere', 'kinangop', 'gla'
            ].map((brand) => (
              <li key={brand}>
                <Link to={`/home/category/${brand}`} style={{ textDecoration: "none" }}>
                  {brand} <span>&gt;</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

      <section className="swappings">
         <img
          src={images[current]}
          alt="Slideshow"
          className="pictures"
          onClick={toggleAutoSlide}
          ref={hove}
          loading="lazy" 
        />
        <div  >
        <button onClick={showPrev} className='lt' ref={lt}>&lt;</button>
        <button onClick={showNext} className='gt' ref={gt}>&gt;</button>
        
        </div>
      </section>
      </div>
 
{/*  
 <div className='hot'>
  <h3>Hot Category</h3>
  {hotCatec.map((catec) => (
        <img key={catec.id} src={catec.url} 
          />
      ))}
</div> */}
  <h3 className='gsap-new' style={{opacity:'1',}} >What are the New Sales</h3>
<div className='new'>
 {newImages.map((newImage)=>(
  <div key={newImage.id} className='newImage'>
<Link to= {`/home/product/${newImage.products_id}`} className='nlinks' style={{textDecoration:"none"}} > 
<img 
     src={newImage.image_url} loading="lazy" />
     <p>{newImage.products_name}</p><p className='quant'> {`${newImage.weight_ml} ml`}</p>
     <p className='price'>Ksh:{newImage.price}</p>
     </Link>
     
</div>
 ))}
</div>
<h3>Tasty Flavours for our  Customers</h3>
 <div className="like">
 {imagesLike.map(
(imagePresent)=>(
  <div key={imagePresent.products_id} className='likedImage'>
 <Link to= {`/home/product/${imagePresent.products_id}`} className='llinks' style={{textDecoration:"none"}} > 
<img 
     src={imagePresent.image_url} loading="lazy" />
     <p> {imagePresent.products_name} </p><p className='quant'>{imagePresent.weight_ml} ml</p>
     <p className='price'>Ksh:{imagePresent.price}</p>
     </Link>

</div>
))}
</div>

    </div>
  );
};

export default Home;

export const n_image = async () => {
  try {
      const res = await fetch('http://localhost:3001/pages/home');
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

