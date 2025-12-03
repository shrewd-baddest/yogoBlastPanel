import React, {  useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { useRef } from 'react';

const Acct = () => {
  const navigate = useNavigate();
  const [details,setdetails] = useState(null);
  const token=localStorage.getItem('token');
  const {refreshCartCount}=useCart();
 const [paymentCheck,setPaymentCheck]=useState('unpaid');
 const [shipmentResults,setShipmentResults]=useState([]);
  const shipStatus=useRef(null);

  


 
  useEffect(() => {
        if (!token) {
      alert("Please log in first");
      navigate('/login'); // navigate to login page
      return;
    }

   const dater = async () => {
    try {
      const response = await fetch('https://yogoblastpanel-3.onrender.com/pages/Acct', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
        setdetails(data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  dater();
}, [])

const shipmentStatus=async()=>{
  console.log(token);
switch(paymentCheck){
  case 'unpaid':
    {
try {
  const response = await fetch('https://yogoblastpanel-3.onrender.com/pages/unpaid', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
const data = await response.json();
    setShipmentResults(data);


} catch (error) {
  console.error("Error fetching account data:", error.message);
}

    }
    break;
    case 'tobeshipped':
      {
        try {
          const response = await fetch('https://yogoblastpanel-3.onrender.com/pages/tobeshipped', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      const data = await response.json();
      console.log(data);
          setShipmentResults(data);

      } catch (error) {
        console.error("Error fetching account data:", error.message);
      }
      }
      break;
      case 'shipped':
        {
          try {
            const response = await fetch('https://yogoblastpanel-3.onrender.com/pages/complete', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
        const data = await response.json();
            setShipmentResults(data);
        } catch (error) {
          console.error("Error fetching account data:", error.message);
        }
  }
        break;
        default:
          console.error("Invalid payment check status");  
          break;

}
 }

 useEffect(() => {
shipmentStatus();
   
 }, [paymentCheck]);


  
  const logOut = async () => {
    try {
      const response = await axios.get('https://yogoblastpanel-3.onrender.com/user/logout' , {
          headers: { Authorization: `Bearer ${token}` }} );
      if (response.data.status === 'success') {
        alert('user successfully logged Out');
        navigate('/home');
      refreshCartCount();
      } else {
        alert(response.data.message || JSON.stringify(response.data));
      }
    } catch (error) {
      alert(error);
    }
  }

  return ( 
    <>
    <div className='Account' style={{ paddingLeft: '8%', paddingRight: '8%' }} >
      <h3>My Orders</h3>
      <div  style={{textDecoration:'none',display:'grid',gridTemplateColumns:'auto'}}>
        <section className='orders'> 

        <p onClick={()=>{setPaymentCheck('unpaid');  }} style={paymentCheck === 'unpaid' ? { textDecoration: 'underline' } : {}}
>Unpaid</p>
        <p onClick={()=>{setPaymentCheck('tobeshipped');  }} style={paymentCheck==='tobeshipped' ? {textDecoration:'underline'} : {}}>To be shipped</p>
        <p onClick={()=>{setPaymentCheck('shipped');   }} style={paymentCheck==='shipped' ? {textDecoration:'underline'} : {}}>Shipped</p>

                </section >
 
        <section style={{border:'1px solid black'}} >


<table className="tables">
  <thead className="bg-gray-100">
    <tr width='100%'>
      <th className="tableHead">Image</th>
      <th className="tableHead">Product Name</th>
      <th className="tableHead">Quantity</th>
      <th className="tableHead">Total Price</th>
      <th className="tableHead">Status</th>
    </tr>
  </thead>
  <tbody >
    { shipmentResults.length>0 && shipmentResults.map((item,index)=>(
      <tr key={index} className="transition hover:bg-gray-50">
        <td className="px-4 py-2">    
                      <img src={item.image_url} alt={item.productName} style={{width:'100px',height:'100px'}}/>
</td>
        <td className="px-4 py-2">{item.products_name}</td>
        <td className="px-4 py-2">{item.quantity}</td>
        <td className=" px-4 py-2">
           {paymentCheck=='unpaid'?item.price:item.totalPrice}
        </td>
        <td className="px-4 py-2">
        {paymentCheck==='shipped' ? 'completed' : paymentCheck==='tobeshipped' ? 'paid' : 'unpaid'}
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </section>


     
      </div>
      <h3>Your Details</h3>
      {details && (
        <div className="customer_info">
          <span>
            <h3>identity:</h3>
            <h4>{details.ID}</h4>
          </span>
          <span>
            <h3>FullName:</h3>
            <h4>{details.firstName} {details.secondName}</h4>
          </span>
          <span>
            <h3>email:</h3>
            <h4>{details.email}</h4>
          </span>
        </div>
      )}
      <button onClick={logOut} className='logOut'>Log Out</button>
    </div>
    </>
  )

}

export default Acct
