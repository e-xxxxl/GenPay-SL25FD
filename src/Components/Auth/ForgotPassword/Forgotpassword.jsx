"use client"

import { useState } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Forgotpassword = ({ onNavigate }) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (value) => {
    setEmail(value)
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail()) return

    setIsSubmitting(true)

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "https://genpay-sl25bd-1.onrender.com/api/auth/forgot-password",
        {
          email: email.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Password reset email sent:", response.data)

      // Show success state
      setIsEmailSent(true)

      // Show success toast
      toast.success("Password reset link sent to your email!", {
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
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Password reset failed:", error.response.data)

        toast.error(error.response.data.message || "Failed to send reset email. Please try again.", {
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

  const handleResendEmail = () => {
    setIsEmailSent(false)
    // Optionally clear the form or keep the email
  }

  // Success state - Email sent
  if (isEmailSent) {
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
              Check Your Email
            </h1>
          </div>

          {/* Success Content */}
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Message */}
            <div className="space-y-4">
              <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Password Reset Link Sent
              </h2>
              <p className="text-white text-sm leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                We've sent a password reset link to <span className="font-medium">{email}</span>. Check your email and
                follow the instructions to reset your password.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
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

              <button
                onClick={handleResendEmail}
                className="w-full text-gray-400 hover:text-white py-3 font-medium transition-all duration-200 text-sm"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Didn't receive email? Try again
              </button>
            </div>

            {/* Help Text */}
            <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              If you don't see the email in your inbox, check your spam folder.
            </p>
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
            Forgot Password
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-8 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {error && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {error}
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
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default Forgotpassword
