"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom"

const Signin = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      localStorage.setItem("token", response.data.token) // Store JWT
      console.log("Login successful:", response.data)

      // Show success toast
      toast.success("Login successful! Welcome back to GenPay.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        style: {
          background: "#1f2937",
          color: "#ffffff",
          border: "1px solid #374151",
          borderRadius: "8px",
          fontFamily: '"Poppins", sans-serif',
          fontSize: "14px",
        },
      })

      // Navigate based on user verification status
      if (response.data.isVerified) {
        // Navigate to dashboard if user is verified
        if (onNavigate) {
          onNavigate("/dashboard")
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        // Navigate to email verification if not verified
        if (onNavigate) {
          onNavigate("/verify-email", { email: formData.email })
        } else {
          window.location.href = "/verify-email"
        }
      }

      // Reset form on success
      setFormData({
        email: "",
        password: "",
      })
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Login failed:", error.response.data)

        toast.error(error.response.data.message || "Login failed. Please check your credentials and try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "14px",
          },
        })
      } else {
        // Other errors (e.g., network error)
        console.error("Error:", error.message)

        toast.error("Connection error. Please check your network and try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "14px",
          },
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    // Add navigation logic here
    if (onNavigate) {
      onNavigate(-1) // Go back
    } else {
      window.history.back()
    }
  }

  const handleSignupRedirect = () => {
    // Add navigation to signup page
    if (onNavigate) {
      onNavigate("/signup")
    } else {
      window.location.href = "/signup"
    }
  }

  return (
    <div className="min-h-screen bg-black md:px-72 px-6 py-8">
      <div  className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Login
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-8 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Your gateway to creative events, merch and meaningful connections.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleSignupRedirect}
            className="text-gray-400 hover:text-white text-xs transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Don't have an Account? Click here
          </button>
          <div>  
          <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>       
            <button
             onClick={() => onNavigate("/forgot-password")} 
            className="text-gray-400 hover:text-white text-xs transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Forgot Password?
          </button>
          </Link>
          </div>

        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1f2937",
          color: "#ffffff",
          border: "1px solid #374151",
          borderRadius: "8px",
          fontFamily: '"Poppins", sans-serif',
          fontSize: "14px",
          minHeight: "60px",
        }}
      />
    </div>
  )
}

export default Signin
