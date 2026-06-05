import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      const res = await axios.get('http://localhost:3000/api/auth/get-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setUser(res.data.user)
    } catch (err) {
      console.error(err)
      setUser(null)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
