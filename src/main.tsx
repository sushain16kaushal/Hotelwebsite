import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProtectedRoute from './components/ProtectedRoute'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from './context/AuthContext';

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
const EditDiningPage =lazy(()=> import('./pages/Admin/EditDiningPage'))
const AuthPage = lazy(() => import('./pages/Admin/AuthPage')) // Customer Login/Signup
const LoginSuccess = lazy(() => import('./pages/Admin/LoginSuccess'))
const ForgotPassword = lazy(() => import('./pages/Admin/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Admin/Resetpassword'))
const router = createBrowserRouter(
  createRoutesFromElements(
    /* 3. Sabse upar wale Route ko Suspense mein lapeto */
    <Route errorElement={<Errorpage />}>
      {/* 1. Admin Login (Existing) */}
      <Route path='/login' element={
          <Suspense fallback={<FullScreenLoader />}><Login /></Suspense>
      } />

      {/* 2. Customer Auth Routes */}
      <Route path='/auth' element={
          <Suspense fallback={<FullScreenLoader />}><AuthPage /></Suspense>
      } />
      <Route path='/login-success' element={
          <Suspense fallback={<FullScreenLoader />}><LoginSuccess /></Suspense>
      } />
      <Route path='/forgot-password' element={
          <Suspense fallback={<FullScreenLoader />}><ForgotPassword /></Suspense>
      } />
      <Route path='/reset-password/:token' element={
          <Suspense fallback={<FullScreenLoader />}><ResetPassword /></Suspense>
      } />
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
      <Route path='/booking' element={<ProtectedRoute roleRequired='customer'><Bookingpage /></ProtectedRoute>} />
      <Route path='/contact' element={<Contact />} />
      <Route 
    path="/admin/dashboard" 
    element={
        <ProtectedRoute roleRequired='admin'>
            <AdminDashboard />
        </ProtectedRoute>
    } 
/>
<Route path="/admin/edit-hotel/:id" element={
        <ProtectedRoute roleRequired='admin'>
          <Suspense fallback={<FullScreenLoader />}><EditHotelPage /></Suspense>
        </ProtectedRoute>
    } />
 <Route path="/admin/edit-dining/:id" element={ <ProtectedRoute roleRequired='admin'>
          <Suspense fallback={<FullScreenLoader />}><EditDiningPage /></Suspense>
        </ProtectedRoute>} />
    </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    </AuthProvider>
  </StrictMode>
)