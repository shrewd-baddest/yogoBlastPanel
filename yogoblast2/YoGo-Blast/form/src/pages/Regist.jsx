import React from 'react'
import { useState } from 'react'
 import axios from 'axios'
import { useNavigate } from 'react-router-dom';

  


 const Regist = () => {
const [ID,setID] =useState('');
  const [fName,setfName]=useState('');
  const [ sName,setsName]=useState('');
  const [email,setemail]=useState('');
  const [pCode,setpCode]=useState('');
 const navigate=useNavigate();
  const handleTest= (e) => {
    
      e.preventDefault();
const url="http://localhost:3001/user/regist";

  // You can now send the name and email via axios to your server
  if(ID!=''&& email!=''&& fName!='' && sName!=''&& pCode!=''){

    const formData = {
      ID: ID,
      email:email,
      fName:fName,
      sName:sName,
      pCode:pCode
    };
  
 
  axios.post(url, formData)
    .then(response =>{ 
  navigate('/login');
    })
    .catch(error => alert(error));
  }
  else{
    alert('please fill all the inputs provided');
  }

    };
  
    
  


  return (
    <>
    <div className="form">

    <form onSubmit={handleTest} >

   National Id:<input type="number" onChange={(e)=>setID( e.target.value)} /><br />
First Name:  <input type="text" onChange={(e)=>setfName( e.target.value)}/><br />
second Name:<input type="text" onChange={(e)=>setsName( e.target.value)} /><br />
Email : <input type="email" onChange={(e)=>setemail(e.target.value)}/><br />
 Password: <input type="password" onChange={(e)=>setpCode(e.target.value)}/><br />
  <input   type="submit"  value='Register' />
    </form>
    </div>
    </>
  )
}

export default Regist
