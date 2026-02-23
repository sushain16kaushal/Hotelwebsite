import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Homepagelayout from './components/Homepage/Homepagelayout'
import Homepage from './components/Homepage/Homepage'
import Roompage from './components/Roompage/Roompage'
import Dining from './components/Dining'
import Bookingpage from './components/Bookingpage'
import Contact from './components/Contact'
import Errorpage from './Errorpage'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<Homepagelayout />} errorElement={<Errorpage />} >
    <Route path='/' element={<Homepage />} />
    <Route path='/room' element={<Roompage />} />
    <Route path='/dining' element={<Dining />} />
    <Route path='/booking' element={<Bookingpage />} />
    <Route path='/contact' element={<Contact />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>
)
