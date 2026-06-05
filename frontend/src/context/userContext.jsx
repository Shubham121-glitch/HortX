import React, { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const userContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(null)
  const [wishlist, setWishlist] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const [userRes, cartRes, wishlistRes, notificationsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/auth/get-user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }),
        axios.get("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }),
        axios.get("http://localhost:3000/api/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }),
        axios.get("http://localhost:3000/api/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
      ])

      setUser(userRes.data.user)
      setCart(cartRes.data.cart)
      setWishlist(wishlistRes.data.wishlist)
      setNotifications(notificationsRes.data.notifications)
    } catch (err) {
      console.error(err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setCart(null)
    setWishlist(null)
    setNotifications([])
    localStorage.removeItem("accessToken")
  }

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    cart,
    setCart,
    wishlist,
    setWishlist,
    notifications,
    setNotifications,
    darkMode,
    setDarkMode,
    fetchUserData,
    logout
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export const useUser = () => useContext(userContext)
export default userContext
