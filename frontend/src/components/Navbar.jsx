import React, { useState } from "react"
import "./navbar.css"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/userContext"
import axios from "axios"
import { toast } from "react-toastify"

const Navbar = () => {
  const { user, logout, cart, wishlist, notifications, darkMode, setDarkMode } = useUser()
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/logout", {
        withCredentials: true
      })
      logout()
      toast.success("Logged out successfully!")
      navigate("/login")
    } catch (err) {
      console.error(err)
      toast.error("Logout failed")
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return null
  }

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          HortX
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${showMobileMenu ? "open" : ""}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/wishlist" className="nav-link">
            Wishlist
            {wishlist && wishlist.products?.length > 0 && (
              <span className="badge">{wishlist.products.length}</span>
            )}
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
            {cart && cart.items?.length > 0 && (
              <span className="badge">{cart.items.length}</span>
            )}
          </Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/notifications" className="nav-link">
            Notifications
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </Link>
          
          {user.accountType === "vendor" && (
            <Link to="/vendor-dashboard" className="nav-link vendor">
              Vendor Dashboard
            </Link>
          )}

          <div className="nav-user">
            <span>Welcome, {user.username}</span>
          </div>

          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
