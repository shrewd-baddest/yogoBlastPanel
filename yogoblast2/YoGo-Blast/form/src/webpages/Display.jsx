import React, {  useRef, useState ,useEffect} from 'react';
import axios from 'axios';
import { useLoaderData,Link } from 'react-router-dom';
import {useCart} from '../pages/CartContext';
import gsap from 'gsap';
    
const Display = () => {
  const details = useLoaderData();
  const { increamentCart, price, setId, setActprice, setNumber, setQuantity, payment, setPrice, number } = useCart();
  const [totals,setTotals]=useState(0);
   const [quantity,setquantity]=useState(1);
   const [choices,setChoices]=useState([])
  const newImages = choices?.[0] || [];
const imagesLike = choices?.[1] || [];
 
   const blurs=useRef();
const pay=useRef()
const token=localStorage.getItem('token');
  useEffect(
()=>{
const n_image = async () => {
  try{
    const res = await fetch('http://localhost:3001/pages/home');
    setChoices(await res.json());
  }
  catch(error){
    console.log(error);
    return null;
  }
  finally{
     console.log('home page');
     
  }
}
n_image();
},
[]
  )
 
 useEffect(() => {
  const tl = gsap.timeline({ duration:3,ease:"power1.out", });

    tl.fromTo(gsap.utils.toArray('.img-gsap'), {
      opacity: 0,
      x: -100,

    },
  {
    opacity:1, 
    x:0,
  }).fromTo(gsap.utils.toArray('.detail-gsap'), {
      opacity: 0,
      x: 100,
    },{
     opacity:1,
    x:0, 
    });
  }, []); // Run once on mount

const subtract=()=>{
  setquantity( prev => Math.max(1, prev - 1));
}
const add=()=>{
  setquantity(prev => prev + 1);
}


 
const addToCart = async (productId) => {
    const cartData = {
      Quantity: quantity,
      productId,
    };
    console.log(cartData.productId);
    try {
      const response = await axios.post(
        'http://localhost:3001/pages/cart',
        cartData, //Include credentials in the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data)
      if(response.data.status=="success"){
         const num=Number(quantity);
        increamentCart(num);
        alert(response.data.message);
      }
      else{
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
const Buy = (item) => {
  // use the currently selected local `quantity` and the passed single item
  const quant = Number(quantity) || 1;
  const pays = parseFloat(item.price) || 0;
  setActprice(pays);
  setId(item.products_id);
  setQuantity(quant);
  const total_pay = pays * quant;
  setTotals(total_pay);
if (blurs.current){
  blurs.current.style.filter='blur(4px)';

    if (pay.current) {
      pay.current.style.display = 'block';
      
    }

}
  }
   
  useEffect(
  ()=>{
   setPrice(totals);
        return ()=>{
          setPrice(0);
        }
  },
  [totals, setPrice]
  )

  return (
    <>
    <div style={{ paddingLeft: '8%', paddingRight: '8%' }}  ref={blurs} >
{
  (details || []).map((detail) => (

    <div key={detail.products_id} className='display'  style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: '10%',
       paddingLeft: '8%',
       paddingRight: '8%',
       paddingBottom: '4%',
       marginTop:'2%',
       opacity:'1',
    }} >
      <img src={detail.image_url} alt="product"  className="img-gsap" />
      
      <div  className="detail-gsap">
      <h2 className='des'>
        {detail.description}
     
      </h2>
      <h3 className='price'>Price: {detail.price}</h3>
    <div className='table'>
      <p>services:</p>  
   <p>Fullfilled By Yogo  </p> 
   <p>product Name:</p>   
   <p>  {detail.products_name} </p>
     
   <p>weight:</p> 
    <p>{detail.weight_ml}ml</p> 
    <p>Quantity:</p> 
     
    <div className='quantity'>
    <button onClick={subtract}>-</button>
       <div>{quantity}</div>
      <button onClick={add}>+</button>
      

      </div>  
      

      </div>
      <div className='Pay_buttons'>
        <button className='cart' onClick={() => addToCart(detail.products_id)}>Add to Cart</button>
        <button className='pay_now' onClick={() => Buy(detail)}>Pay Now</button></div>
      </div>
    </div>
    
    ))
  }
  
<h3 className='gsap-new' style={{opacity:'1',}} >What are the New Sales</h3>
<div className='new'>
 {newImages.map((newImage)=>(
  <div key={newImage.products_id} className='newImage'>
<Link to= {`/home/product/${newImage.products_id}`} className='nlinks' style={{textDecoration:"none"}} > 
<img 
     src={newImage.image_url} loading="lazy" />
     <p> {newImage.products_name} {newImage.weight_ml} ml</p>
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
     <p> {imagePresent.products_name} {imagePresent.weight_ml} ml</p>
     <p className='price'>Ksh:{imagePresent.price}</p>
     </Link>

</div>
))}
</div>
 </div>
 <div className="pay_form" ref={pay}>
                    <div>
                      <button title='close' className='close'onClick={()=>{pay.current.style.display='none';  blurs.current.style.filter='blur(0px)';
}}>x</button>
        <p className='cart-psg'>we guarantee a secure money transaction and 100% refund</p>
              <p className='cart-price'>Ksh:{price!=null?price.toFixed(2):'0.00'}</p>
                    </div>
                  <form onSubmit={e => { e.preventDefault(); payment(); }} >
                    <div className='payment-form'>       <label style={{fontWeight:'bold'}}>Phone Number:</label>
              <input
    type="tel"
    value={number}
    maxLength={12}
    onChange={e => {
       const input = e.target.value;
      if (input.startsWith('254')) {
        setNumber(input);
      } else if (input.length < 3) {
        setNumber('254');
      }
     }}
    placeholder="254xxxxxxxxx"
    className='payment-input'
    
  />
  </div>
              <button className='pay' type="submit">Submit</button>
      </form>
           
  
    </div>
    </>
  )
}

export default Display

// loader moved to separate file to avoid fast-refresh issues
 

