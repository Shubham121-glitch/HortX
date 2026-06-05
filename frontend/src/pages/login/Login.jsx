import React from 'react'
import './login.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const { setUser } = useUser()
  
  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', data)
      localStorage.setItem('accessToken', res.data.accessToken)
      setUser(res.data.user)
      toast.success(res.data.message || 'Logged in successfully!')
      navigate('/')
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(errorMsg)
    }
  }

    return (
        <div className="login">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Welcome Back</h1>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })} 
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        {...register('password', { required: 'Password is required' })} 
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                
                <input 
                    type="submit" 
                    value={isSubmitting ? 'Logging in...' : 'Login'} 
                    disabled={isSubmitting}
                />
                
                <div className="link-container">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </form>
        </div>
    )
}

export default Login