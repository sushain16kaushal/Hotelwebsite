import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

// 1. Loader ko import karo (taaki ye 'intezaar' ke waqt dikhe)
import FullScreenLoader from './components/FullScreenLoader' 

// 2. Normal imports ko 'lazy' imports mein badlo
const Homepagelayout = lazy(() => import('./components/Homepage/Homepagelayout'))
const Homepage = lazy(() => import('./components/Homepage/Homepage'))
const Roompage = lazy(() => import('./components/Roompage/Roompage'))
const Details = lazy(() => import('./components/Roompage/Details'))
const Dining = lazy(() => import('./components/Dining'))
const Bookingpage = lazy(() => import('./components/Bookingpage'))
const Contact = lazy(() => import('./components/Contact'))
const Errorpage = lazy(() => import('./Errorpage'))

const router = createBrowserRouter(
  createRoutesFromElements(
    /* 3. Sabse upar wale Route ko Suspense mein lapeto */
    <Route 
      path='' 
      element={
        <Suspense fallback={<FullScreenLoader />}>
          <Homepagelayout />
        </Suspense>
      } 
      errorElement={<Errorpage />} 
    >
      <Route path='/' element={<Homepage />} />
      <Route path='/room' element={<Roompage />} />
      <Route path='/room/:id' element={<Details />} />
      <Route path='/dining' element={<Dining />} />
      <Route path='/booking' element={<Bookingpage />} />
      <Route path='/contact' element={<Contact />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)