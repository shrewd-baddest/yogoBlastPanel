import React from 'react';
 import { createBrowserRouter,createRoutesFromElements,Route, RouterProvider } from 'react-router-dom';
// import './App.css';
import Loginn from './pages/Loginn';
import Regist from './pages/Regist';
import Body from './Layout/Body';
 import Not from './pages/Not';
import Home, { n_image } from './webpages/Home';
import Categories, { Category } from './webpages/Categories';
import Cart  from './webpages/Cart';
import Acct from './webpages/Acct';
import Contact from './webpages/contact';
 import LayOut from './Layout/LayOut';
import Display, { productDetails } from './webpages/Display';
import Error from './pages/Error';
import Search from './webpages/search';
import Welcome from './pages/Welcome';
 
function App() {
  const router=createBrowserRouter(
createRoutesFromElements(
 <>
 <Route path='/' element={<Welcome/>} />
  <Route  path='/login' element={<Body />}>
  <Route index element={<Loginn/>} />
  <Route path='signup' element={<Regist/>} />
  </Route>      

<Route path='/home' element={<LayOut/>}  errorElement={<Error/>}>
  <Route  index  element={<Home/>} loader={n_image}/>
  <Route path='category/:cate' element={<Categories/>} loader={Category} /> 
  <Route path='contact' element={<Contact/>} /> 
  <Route path='cart' element={<Cart/>}/>
  <Route path='account' element={<Acct/>}/>
  
  <Route path='product/:id' element={<Display/>} loader={productDetails}/>
  <Route path='search' element={<Search/>}/>
  </Route>
  <Route path='*' element={<Not/>}/>
  </>
),
{
  future: {
    v7_relativeSplatPath: true
  }
}

  )
  return <RouterProvider router={router} />;
}

export default App
