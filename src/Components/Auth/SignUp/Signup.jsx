"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react"

const Signup = () => {
  const [formData, setFormData] = useState({
    userType: "individual",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Signup successful:", result)
        // Handle successful signup (redirect, show success message, etc.)
        alert("Account created successfully!")
      } else {
        const errorData = await response.json()
        console.error("Signup failed:", errorData)
        alert("Signup failed. Please try again.")
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    // Add navigation logic here
    window.history.back()
  }

  const handleLoginRedirect = () => {
    // Add navigation to login page
    console.log("Redirect to login")
  }

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
          >
            <ArrowLeft className="w-4 h-4 text-white" onClick={handleGoBack} />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Sign Up
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-6 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Your gateway to creative events, merch and meaningful connections.
        </p>

        {/* User Type Toggle */}
        <div className="flex mb-6 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange("userType", "individual")}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
              formData.userType === "individual" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            style={{
              background:
                formData.userType === "individual" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => handleInputChange("userType", "organization")}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
              formData.userType === "organization" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            style={{
              background:
                formData.userType === "organization" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Organization
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <Plus className="w-3 h-3 text-white" />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.location && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.location}
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
              style={{ fontFamily: '"Poppins", sans-serif' }}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
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
            }}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <button
            onClick={handleLoginRedirect}
            className="text-gray-400 hover:text-white text-xs transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Already have an Account? Click here
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup
