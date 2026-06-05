import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Logout = () => {
    const navigate = useNavigate()
    axios.get('http://localhost:3000/api/auth/logout').then(res => {
        console.log(res)
        navigate('/login')
    })
  return (
    <div>Logout</div>
  )
}

export default Logout