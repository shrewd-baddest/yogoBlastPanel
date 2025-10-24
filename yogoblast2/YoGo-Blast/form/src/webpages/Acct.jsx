import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Acct = () => {
  const navigate = useNavigate();
  const [details,setdetails] = useState(null);
  const token=localStorage.getItem('token');

 
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

  const logOut = async () => {
    try {
      const response = await axios.get('https://yogoblastpanel-3.onrender.com/user/logout' , {
          headers: { Authorization: `Bearer ${token}` }} );
      if (response.data.status === 'success') {
        alert('user successfully logged Out');
        navigate('/home');
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
      <div className='orders'>
        <p>Unpaid</p>
        <p>To be shipped</p>
        <p>Shipped</p>
        <p>Reviews</p>
      </div>

      <h3>My Services</h3>
      <div className='services'>
        <p>FAQ</p>
        <p>Customer Service</p>
        <p>Settings</p>
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
