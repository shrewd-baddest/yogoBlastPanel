import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);
   const [number, setNumber] = useState('254');
    const [price,setPrice]=useState(0);
    const [id,setId]=useState(null);
    const [quantity,setQuantity]=useState(null);
    const [actprice,setActprice]=useState(0);
  const refreshCartCount = () => {
    const token=localStorage.getItem('token');
    axios.get('http://localhost:3001/pages/cart', {
          headers: { Authorization: `Bearer ${token}` }})
      .then(response => {
        const Counts = parseInt(response.data.total_quantity, 10) || 0;
        setCount(Counts);
      })
      .catch(error => {
        console.error('Error fetching cart count:', error);
      });
  };          
  useEffect(() => {
    refreshCartCount();
  }, []); 

  const increamentCart = (quantity) => {
    const num = Number(quantity);
    setCount(prev => Math.max(0, prev + (isNaN(num) ? 0 : num)));
    refreshCartCount();  
  };
  const payment = async () => {
  if (!id || !quantity) {
  alert('Please select a product to buy.');
  return;
}
  const paymentData = {
     productId: id,
    phoneNumber: number,
    price: price,
  };

  try {
    // 1. Send payment request to backend
    const res = await axios.post('http://localhost:3001/pages/payment', paymentData, {
          headers: { Authorization: `Bearer ${token}` }});
     if (res.data.status === 'success') {
      // 2. Wait 10 seconds to give M-Pesa time to send callback
      await new Promise(resolve => setTimeout(resolve, 10000));

      // 3. Ask backend if payment status is successful
      const orderRes = await axios.post(
        'http://localhost:3001/pages/orders',
        { productId: id, 
          price:actprice,
          quantity: quantity }, {
          headers: { Authorization: `Bearer ${token}` }});

      if (orderRes.data.status === 'success') {
        alert('Order placed successfully!');
        // navigate('/home');
      } else if (orderRes.data.status === 'pending') {
        alert('Payment is still pending. Please wait or try again later.');
      } else {
        console.log('Order failed: ' + orderRes.data.message);
      }
    } else {
      alert('STK Push failed: ' + res.data.message);
    }
  } catch (error) {
    console.log('Error during payment:', error);
   } finally {
    setNumber('254'); // Reset phone number input
  }
 
};

  return (
    <cartContext.Provider value={{ count, increamentCart, payment, id, setId, setActprice,setNumber,setQuantity,setPrice,price }}>
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => useContext(cartContext);

