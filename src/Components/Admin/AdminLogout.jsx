"use client"
import { useNavigate } from 'react-router-dom'

const AdminLogout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com"
      
      // Call logout endpoint
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      navigate('/admin/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      style={{ fontFamily: '"Poppins", sans-serif' }}
    >
      Logout
    </button>
  )
}

export default AdminLogout