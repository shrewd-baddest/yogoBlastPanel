import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {CartProvider} from './pages/CartContext.jsx'
import  {GoogleOAuthProvider} from '@react-oauth/google'

import App from './App.jsx'
import Cart from './webpages/Cart.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <GoogleOAuthProvider  clientId="234340568670-027jkb459i6l5msgcpc6d7ejbgp9h5b3.apps.googleusercontent.com">
     <App/>
    
    </GoogleOAuthProvider>
      </CartProvider>
  </StrictMode>
)
 
   