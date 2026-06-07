import React, { useState, useEffect, useRef } from "react"
import "./navbar.css"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../context/userContext"
import axios from "axios"
import { toast } from "react-toastify"
import {
  Home, ShoppingBag, Heart, Package, Bell, LayoutDashboard,
  ShoppingCart, LogOut, Sun, Moon, Menu, X, Leaf, User, ChevronDown
} from "lucide-react"

const Navbar = () => {
  const { user, logout, cart, wishlist, notifications, darkMode, setDarkMode } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setShowMobileMenu(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully!")
      navigate("/login")
    } catch (err) {
      console.error(err)
      toast.error("Logout failed")
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const cartCount = cart?.items?.length || 0
  const wishlistCount = wishlist?.products?.length || 0

  if (!user) return null

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: "/", label: "Shop", icon: ShoppingBag },
    { path: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { path: "/orders", label: "Orders", icon: Package },
    { path: "/notifications", label: "Alerts", icon: Bell, badge: unreadCount },
  ]

  if (user.accountType === "vendor") {
    navLinks.push({ path: "/vendor-dashboard", label: "Dashboard", icon: LayoutDashboard })
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" id="nav-logo">
            <div className="logo-icon">
              <Leaf size={22} />
            </div>
            <span className="logo-text">HortX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-center">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                id={`nav-link-${link.label.toLowerCase()}`}
              >
                <link.icon size={18} className="nav-link-icon" />
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="nav-badge">{link.badge > 9 ? "9+" : link.badge}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="navbar-right">
            {/* Cart */}
            <Link to="/cart" className={`nav-icon-btn ${isActive("/cart") ? "active" : ""}`} id="nav-cart-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="icon-badge">{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              id="dark-mode-toggle"
              aria-label="Toggle dark mode"
            >
              <div className={`toggle-track ${darkMode ? "dark" : ""}`}>
                <div className="toggle-thumb">
                  {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                </div>
              </div>
            </button>

            {/* User Menu */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-btn"
              >
                <div className="avatar">
                  <User size={16} />
                  <span className="online-dot"></span>
                </div>
                <span className="username">{user.username}</span>
                <ChevronDown size={14} className={`chevron ${showUserMenu ? "open" : ""}`} />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="dropdown-name">{user.username}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout} id="logout-btn">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${showMobileMenu ? "open" : ""}`} onClick={() => setShowMobileMenu(false)} />
      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="mobile-user-info">
            <div className="mobile-avatar">
              <User size={20} />
            </div>
            <div>
              <p className="mobile-username">{user.username}</p>
              <p className="mobile-email">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="mobile-badge">{link.badge}</span>
              )}
            </Link>
          ))}
          <Link to="/cart" className={`mobile-nav-link ${isActive("/cart") ? "active" : ""}`}>
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
          </Link>
        </div>

        <div className="mobile-menu-footer">
          <button className="mobile-theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="mobile-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
