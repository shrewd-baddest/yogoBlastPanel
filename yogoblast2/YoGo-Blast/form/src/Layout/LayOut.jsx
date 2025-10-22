 import Nav from '../Navigation/Nav'
 import '../styling/pages.css'
import Footer from '../Navigation/Footer'
import { Outlet } from 'react-router-dom'
const LayOut = () => {
  return (
    <div style={{'margin':'0px'}} >
      <Nav />
     <Outlet/>
      <Footer/>
    </div>
  )
}

export default LayOut
