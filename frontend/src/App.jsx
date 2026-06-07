import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Navbar from './components/Navbar'
import VendorDashboard from './pages/vendor/VendorDashboard'
import Shop from './pages/shop/Shop'
import Cart from './pages/cart/Cart'
import Orders from './pages/orders/Orders'
import Wishlist from './pages/wishlist/Wishlist'
import Notifications from './pages/notifications/Notifications'
import ProductDetail from './pages/product/ProductDetail'
import { UserProvider, useUser } from './context/userContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser()
  
  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner large"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
