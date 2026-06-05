import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import './home.css'

const Home = () => {
  const navigate = useNavigate()
  const { user, setUser, setLoading } = useUser()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/auth/get-user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        
        setUser(res.data.user)
        setLoading(false)
        
        if (res.data.user.accountType === 'vendor') {
          navigate('/vendor-dashboard')
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
        navigate('/login')
      }
    }

    if (!user) {
      fetchUserData()
    } else if (user.accountType === 'vendor') {
      navigate('/vendor-dashboard')
    }
  }, [navigate, setUser, setLoading, user])

  if (!user) {
    return (
      <div className="home-loading">
        Loading...
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome Back, {user.username}!</h1>
        <div className="home-user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Type:</strong> {user.accountType}</p>
          {user.address && (
            <div className="home-address">
              <h3>Address</h3>
              <p>{user.address.state}, {user.address.district}</p>
              <p>{user.address.tehsil} - {user.address.pin}</p>
              <p><strong>Contact:</strong> {user.address.contactNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home