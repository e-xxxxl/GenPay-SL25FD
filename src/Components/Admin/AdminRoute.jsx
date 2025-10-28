"use client"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      const adminData = localStorage.getItem('adminData')

      if (!token || !adminData) {
        navigate('/admin/login')
        return
      }

      try {
        // Verify token with backend
        const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com"
        const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminData')
          navigate('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        navigate('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-white">Verifying admin access...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : null
}

export default AdminRoute