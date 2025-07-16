"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useParams, useSearchParams } from "react-router-dom"

const Resetpassword = ({ onNavigate }) => {
     const { token } = useParams();
    const [searchParams] = useSearchParams();
 console.log("Token from URL:", token); // Verify this shows your JWT token

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
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


    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Token being sent:", token); // Add this line
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        "https://genpay-sl25bd.onrender.com/api/auth/reset-password",
        {
          token, // Include the token from URL
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      console.log("Password reset successful:", response.data)

      // Show success state
      setIsPasswordReset(true)

      // Show success toast
      toast.success("Password reset successfully!", {
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

      // Reset form
      setFormData({
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Password reset failed:", error.response.data)

        toast.error(error.response.data.message || "Failed to reset password. Please check your email and try again.", {
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
    if (onNavigate) {
      onNavigate(-1) // Go back
    } else {
      window.history.back()
    }
  }

  const handleBackToLogin = () => {
    if (onNavigate) {
      onNavigate("/signin")
    } else {
      window.location.href = "/signin"
    }
  }

  // Success state - Password reset successfully
  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Password Reset
            </h1>
          </div>

          {/* Success Content */}
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <Check className="w-8 h-8 text-white" />
            </div>

            {/* Message */}
            <div className="space-y-4">
              <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Password Reset Successful
              </h2>
              <p className="text-white text-sm leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Your password has been successfully reset. You can now login with your new password.
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleBackToLogin}
              className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main forgot password form
  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Reset Password
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-8 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Enter your email address and create a new password for your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* New Password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.newPassword && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackToLogin}
            className="text-gray-400 hover:text-white text-xs transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Remember your password? Back to Login
          </button>
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

export default Resetpassword
