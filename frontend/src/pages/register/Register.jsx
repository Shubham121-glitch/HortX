import React from 'react'
import './register.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const { setUser } = useUser()
  
  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', data)
      localStorage.setItem('accessToken', res.data.accessToken)
      setUser(res.data.user)
      toast.success(res.data.message || 'Registered successfully!')
      navigate('/')
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMsg)
    }
  }

  return (
    <div className="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Account</h1>
        
        <div>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            {...register('username', { required: 'Username is required' })} 
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        
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
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })} 
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="accountType">Account Type</label>
          <select 
            id="accountType" 
            {...register('accountType', { required: 'Account type is required' })}
            style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '0.25rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }}
          >
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>
          {errors.accountType && <p className="error">{errors.accountType.message}</p>}
        </div>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#2d3748' }}>Address</h3>
        
        <div>
          <label htmlFor="state">State/UT</label>
          <input 
            type="text" 
            id="state" 
            {...register('address.state', { required: 'State/UT is required' })} 
          />
          {errors.address?.state && <p className="error">{errors.address.state.message}</p>}
        </div>
        
        <div>
          <label htmlFor="district">District</label>
          <input 
            type="text" 
            id="district" 
            {...register('address.district', { required: 'District is required' })} 
          />
          {errors.address?.district && <p className="error">{errors.address.district.message}</p>}
        </div>
        
        <div>
          <label htmlFor="tehsil">Tehsil</label>
          <input 
            type="text" 
            id="tehsil" 
            {...register('address.tehsil', { required: 'Tehsil is required' })} 
          />
          {errors.address?.tehsil && <p className="error">{errors.address.tehsil.message}</p>}
        </div>
        
        <div>
          <label htmlFor="pin">PIN Code</label>
          <input 
            type="text" 
            id="pin" 
            {...register('address.pin', { 
              required: 'PIN is required',
              pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: 'Please enter a valid 6-digit PIN'
              }
            })} 
          />
          {errors.address?.pin && <p className="error">{errors.address.pin.message}</p>}
        </div>
        
        <div>
          <label htmlFor="contactNumber">Contact Number</label>
          <input 
            type="tel" 
            id="contactNumber" 
            {...register('address.contactNumber', { 
              required: 'Contact number is required',
              pattern: {
                value: /^[6-9][0-9]{9}$/,
                message: 'Please enter a valid 10-digit mobile number'
              }
            })} 
          />
          {errors.address?.contactNumber && <p className="error">{errors.address.contactNumber.message}</p>}
        </div>
        
        <input 
          type="submit" 
          value={isSubmitting ? 'Creating Account...' : 'Create Account'} 
          disabled={isSubmitting}
        />
        
        <div className="link-container">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  )
}

export default Register