"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Admin login API call
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials")
      }

      // Store admin token and admin data
      localStorage.setItem("adminToken", data.data.token)
      localStorage.setItem("adminData", JSON.stringify(data.data.admin))

      // Navigate to admin dashboard
      navigate("/admin/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // List of valid admin emails for validation
  const validAdminEmails = [
    'toluwanimi@genpay.ng',
    'oluwatosin@genpay.ng', 
    'emmanuel@genpay.ng',
    'kolapo@genpay.ng'
  ]

  const isEmailValid = validAdminEmails.includes(formData.email.toLowerCase())

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" style={{ color: "#A228AF" }} />
            </button>
            <h1 className="text-white text-xl font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Admin Login
            </h1>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed ml-11" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Restricted access - Authorized personnel only
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
          {/* Email Address */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Admin Email Address"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400 transition-colors"
              required
              disabled={loading}
              list="admin-emails"
            />
            <datalist id="admin-emails">
              {validAdminEmails.map(email => (
                <option key={email} value={email} />
              ))}
            </datalist>
            
            {formData.email && !isEmailValid && (
              <p className="text-red-400 text-xs mt-1">
                Only authorized admin emails are allowed
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-12 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400 transition-colors"
              required
              disabled={loading}
              minLength={8}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password || !isEmailValid}
              className="w-full py-3 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading || !isEmailValid ? "#4B5563" : "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Login to Admin Panel"
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-400 text-xs text-center" style={{ fontFamily: '"Poppins", sans-serif' }}>
            ⚠️ This panel contains sensitive financial data. Ensure you logout after use.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin