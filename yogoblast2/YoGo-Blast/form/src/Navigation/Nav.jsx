import React,{useState,useEffect } from 'react';
import { Link,useLocation,useNavigate} from 'react-router-dom';
 import yogo from '../images/yogoo.jpg';
 import {useCart} from '../pages/CartContext';
// import menu from '../images/menu'
const Nav = () => {
  const {count}=useCart();
const [search,setsearch]=useState('');
const [loading,setLoading]=useState(true);
const navigate=useNavigate();
const location=useLocation();
const paths=location.pathname.split('/').filter(Boolean);
const nonLinkSegments=['product','category'];


useEffect(
()=>{
setLoading(true);
  const timer=setTimeout(() => {
    setLoading(false);
  }, 2000);

  return ()=>{clearTimeout(timer)};
},[location]
);




const handle=()=>{
  if (search.trim()!==''){
navigate(`/home/search?q=${encodeURIComponent(search)}`);


  }
  }
  return (
    <div >
       <h2>GET YOUR BEST CHOICE FLAVOUR</h2>
       <div className='T_nav'> 
     <img src={yogo} alt="" />
     <input type="text" placeholder='search...'id='search' onChange={(e)=>{setsearch(e.target.value)}}/> 
      <input type="submit" value='🔍' id='sear' onClick={handle} />
      <ul className='nav'>
      <li>  <Link to='account' style={{textDecoration:"none"}} > 👤user</Link></li> 
      <li><Link to='cart' style={{textDecoration:"none"}}> 🛒<sup>{isNaN(count) ? 0 : count}</sup>Cart</Link></li>
      </ul>
      <button onClick={()=>{navigate('/login')}} className='sign-up'>Sign Up</button>
      </div>
      <div style={{margin:'0.6%',paddingLeft:'8%',fontSize:'1.2rem'}}>
  <Link to={'/home'} style={{textDecoration:'none'}}>Home</Link>
 {
  paths.slice(1).map((path, index) => {
    const fullPath = `/${paths.slice(0, index + 2).join('/')}`;
    const isNonLink = nonLinkSegments.includes(path.toLowerCase());
 
    return (
      <span key={index}>
      
        {!isNonLink &&   (
          <Link to={fullPath} style={{ textDecoration: 'none' }}>
            {' > '}  {decodeURIComponent(path)}
          </Link>
        )}
      </span>
    );
  })
}


      </div>

{
loading && <div className='loader'>
  loading...
  </div>
  }

     </div>
  )
}

export default Nav
