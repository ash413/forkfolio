import React from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('token')
    const isTokenValid = () => {
        if (!token) {
            return false;
        }
        else {
            return true
        }
    }
  return isTokenValid() ? children : <Navigate to='/login' />  
}

export default ProtectedRoute