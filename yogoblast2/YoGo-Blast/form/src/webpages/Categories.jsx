import axios from 'axios'
import React from 'react'
import {Link, useLoaderData  } from 'react-router-dom'

const Categories = () => {
  const categoryInfo=useLoaderData();
  console.log(categoryInfo);
  return (
    <div style={{ paddingLeft: '8%', paddingRight: '8%' }}>

      <div className="category">


        {    categoryInfo.map(
      (product,index)=>(
      <div key={index} className='likedImage'>
      
      <Link to= {`/home/product/${product.products_id}`} className='llinks' style={{textDecoration:"none"}} > 
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

export default Categories

export const Category=async ({params}) => {
 const {cate}=params;
 const Name={
  categ:cate,
 }
 try{

   const response=await axios.post('http://localhost:3001/pages/Category',Name);
   if(response.data){
    return response.data;
   }
   else{
    throw new Error("No Data Found");
    
   }

 }
 catch(error){
  alert(error.message);
  return null
 }
}