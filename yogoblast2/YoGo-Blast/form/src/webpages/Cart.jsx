import React, { useEffect, useRef, useState } from 'react'
   import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../pages/CartContext'
import gsap from 'gsap'

 
const Cart = () => {
  const { increamentCart, count ,setId, setActprice, setNumber, setQuantity, payment, setPrice,number,price} = useCart();
  const navigate = useNavigate();
 const [totals, setTotals] = useState(0);
  const [products, setproducts] = useState([]);
 
  const pay=useRef();
  const blurs=useRef();
   const token=localStorage.getItem('token');
    if (!token) {
  alert("Please log in first");
  
}
  
   const fetchblursucts = async () => {
    try {
      const response = await fetch('https://yogoblastpanel-3.onrender.com//pages/cartDisplay', {
          headers: { Authorization: `Bearer ${token}`}});
      const data = await response.json();
      console.log(data);
      setproducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      console.log('Cart page');
    }
  };
  useEffect(
    ()=>{
    fetchblursucts();

    },[count]
  )

  useEffect(() => {
const tl=gsap.timeline();
// const plays=gsap.utils.toArray('.cart-products');
tl.from(
  '.cart-products',{
    opacity:0,
    duration:1.4,
    x:-300,
    stagger:{
      amount:3,
      grid:'auto',
      axis:'x',
      from:'end'
    }
   }
  //  ,{
  //   opacity:1,
  //   x:0,
  // } 
)
  }, []);

const Buy = (product) => {
    const quant = parseInt(product.quantity);
    const pays = parseFloat(product.price);
    setActprice(pays);
    setId(product.products_id);
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
        console.log(price);
        return ()=>{
        setPrice(prev=>prev=0);
        }
  },
  [totals]
  )





  const deleteProduct = async(product) => {
    //  setDeletingId(product.products_id);
    const deletedQuantity = product.quantity - 1;
    const deleteData = {
      deleteId: product.products_id,
      deleteQuantity: deletedQuantity
    };

    try {
      const res = await axios.post('https://yogoblastpanel-3.onrender.com/pages/update', deleteData, {
          headers: { Authorization: `Bearer ${token}` }});
     console.log(res);
      if (res.data.status === "success") {
        increamentCart(-1);
        alert(res.data.message);
        // Refresh the cart after successful delete
        fetchblursucts();
      } else {
        console.error('Error while updating the cart:', res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
      
  };

  return (
  <div>
 
    <div ref={blurs} >
      {products && products.length > 0 ? (
        products.map((product) =>(
          <div key={product.products_id} className='cart-products' >
             <img src={product.image_url} className='cart-Image' />
            <p className='cart-weight'>{product.weight_ml}ml</p>
            <p className='cart-quantity'>{product.quantity}</p>
            <div className='cart-buttons'>
              <button onClick={() => { navigate(`/home/product/${product.products_id}`) }}>View</button>
              <button onClick={()=>{Buy(product)}}>Buy</button>
<button onClick={() => deleteProduct(product)} className='delete' >
  Delete
  
</button>
            </div>
       
          </div>
          
        ))
      ) : (
        <p>No products found.</p>
      )}
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
 
    </div>
  )
}
 
export default Cart

