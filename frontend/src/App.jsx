import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Navbar from './components/Navbar'
import VendorDashboard from './pages/vendor/VendorDashboard'
import Shop from './pages/shop/Shop'
import Cart from './pages/cart/Cart'
import Orders from './pages/orders/Orders'
import Wishlist from './pages/wishlist/Wishlist'
import Notifications from './pages/notifications/Notifications'
import ProductDetail from './pages/product/ProductDetail'
import { UserProvider } from './context/userContext'

const App = () => {
  return (
    <UserProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App
