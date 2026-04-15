import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProtectedRoute from './components/ProtectedRoute'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'


import FullScreenLoader from './components/FullScreenLoader' 
const Login= lazy(() => import('./pages/Admin/Login'))
const Homepagelayout = lazy(() => import('./components/Homepage/Homepagelayout'))
const Homepage = lazy(() => import('./components/Homepage/Homepage'))
const Roompage = lazy(() => import('./components/Roompage/Roompage'))
const Details = lazy(() => import('./components/Roompage/Details'))
const Dining = lazy(() => import('./components/Dining'))
const Bookingpage = lazy(() => import('./components/Bookingpage'))
const Contact = lazy(() => import('./components/Contact'))
const Errorpage = lazy(() => import('./Errorpage'))
const AdminDashboard = lazy(()=> import('./pages/Admin/AdminDashboard'))
const EditHotelPage = lazy(()=> import('./pages/Admin/EditHotelPage'))
const EditFeatures = lazy(()=> import('./pages/Admin/EditFeatures'))
const router = createBrowserRouter(
  createRoutesFromElements(
    /* 3. Sabse upar wale Route ko Suspense mein lapeto */
    <Route errorElement={<Errorpage />}>
      <Route 
    path='/login' 
    element={
      <Suspense fallback={<FullScreenLoader />}>
        <Login />
      </Suspense>
    } 
  />
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
      <Route 
    path="/admin/dashboard" 
    element={
        <ProtectedRoute>
            <AdminDashboard />
        </ProtectedRoute>
    } 
/>
<Route path="/admin/edit-hotel/:id" element={
        <ProtectedRoute>
          <Suspense fallback={<FullScreenLoader />}><EditHotelPage /></Suspense>
        </ProtectedRoute>
    } />
    <Route path="/admin/edit-features/:id" element={
  <ProtectedRoute>
    <EditFeatures />
  </ProtectedRoute>
} />
    </Route>
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