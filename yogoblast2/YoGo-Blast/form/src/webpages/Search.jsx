import React,{ useEffect, useState }  from 'react'
import  {Link,useSearchParams } from 'react-router-dom';
import axios from 'axios';
const Search = () => {
    const [searchParams]=useSearchParams();
    const query=searchParams.get('q');
      const [products,setproducts]=useState([]);
      
    
useEffect(

  ()=>{
const fetchData=async()=>{
  try {
    const response = await axios.post('http://localhost:3001/pages/search', {
      search: query,
    });
       console.log("Response received:", response.data);
    setproducts(response.data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};
fetchData();
},

[query]
)

  return (
    <div style={{ paddingLeft: '8%', paddingRight: '8%' }}>
      <h2>welcome for the search of {query}</h2>
       
 <div className='new' >

  {    products.map(
(product,index)=>(
<div key={index} className='newImage'>

<Link to= {`/home/product/${product.products_id}`} className='nlinks' style={{textDecoration:"none"}} > 
<img src={product.image_url}/>
 <p>{product.products_name} {product.weight_ml} ml</p>
  <p  className='price'>{product.price} KES</p>
  </Link>
  </div>
)
)}
   
</div>
    </div>
  )
}

export default Search

