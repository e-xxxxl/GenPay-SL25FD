"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Save } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const nigerianStates = [
  "Lagos, Ikeja",
  "Abia, Umuahia",
  "Adamawa, Yola",
  "Akwa Ibom, Uyo",
  "Anambra, Awka",
  "Bauchi, Bauchi",
  "Bayelsa, Yenagoa",
  "Benue, Makurdi",
  "Borno, Maiduguri",
  "Cross River, Calabar",
  "Delta, Asaba",
  "Ebonyi, Abakaliki",
  "Edo, Benin City",
  "Ekiti, Ado Ekiti",
  "Enugu, Enugu",
  "FCT, Abuja",
  "Gombe, Gombe",
  "Imo, Owerri",
  "Jigawa, Dutse",
  "Kaduna, Kaduna",
  "Kano, Kano",
  "Katsina, Katsina",
  "Kebbi, Birnin Kebbi",
  "Kogi, Lokoja",
  "Kwara, Ilorin",
  "Nasarawa, Lafia",
  "Niger, Minna",
  "Ogun, Abeokuta",
  "Ondo, Akure",
  "Osun, Osogbo",
  "Oyo, Ibadan",
  "Plateau, Jos",
  "Rivers, Port Harcourt",
  "Sokoto, Sokoto",
  "Taraba, Jalingo",
  "Yobe, Damaturu",
  "Zamfara, Gusau",
]

const EditInfo = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    userType: "individual",
  })

  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Email masking function
  const maskEmail = (email) => {
    if (!email) return ""
    const [name, domain] = email.split("@")
    if (!domain || name.length < 3) return `***@${domain}`
    const first = name[0]
    const second = name[1]
    const last = name[name.length - 1]
    const masked = "*".repeat(name.length - 2)
    return `${first}${second}${masked}${last}@${domain}`
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await axios.get("https://genpay-sl25bd.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data.data.user
        const userFormData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          location: userData.location || "",
          userType: userData.userType || "individual",
        }

        setFormData(userFormData)
        setOriginalData(userFormData)
      } catch (err) {
        console.error("Error fetching user data:", err)
        toast.error("Failed to load user data", {
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
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = formData.userType === "individual" ? "First name is required" : "Brand name is required"
    }

    if (formData.userType === "individual" && !formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (formData.userType === "organization" && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    // Email validation removed since it's now read-only

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hasChanges = () => {
    // Exclude email from change detection since it's read-only
    const { email: originalEmail, ...originalWithoutEmail } = originalData
    const { email: currentEmail, ...currentWithoutEmail } = formData
    return JSON.stringify(currentWithoutEmail) !== JSON.stringify(originalWithoutEmail)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!hasChanges()) {
      toast.info("No changes to save", {
        position: "top-right",
        autoClose: 3000,
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
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")

      // Exclude email from the update payload since it's read-only
      const { email, ...updateData } = formData

      const response = await axios.put("https://genpay-sl25bd.onrender.com/api/auth/update-profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Profile updated successfully:", response.data)

      // Update original data to reflect saved changes
      setOriginalData(formData)

      toast.success("Profile updated successfully!", {
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

      // Navigate back to account page after successful update
      setTimeout(() => {
        handleGoBack()
      }, 2000)
    } catch (error) {
      if (error.response) {
        console.error("Profile update failed:", error.response.data)
        toast.error(error.response.data.message || "Failed to update profile. Please try again.", {
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
      onNavigate("/account")
    } else {
      window.history.back()
    }
  }

  const getLoadingAnimation = () => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "0ms",
            }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "150ms",
            }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center justify-center py-12">{getLoadingAnimation()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
      <div className="w-full max-w-sm mx-auto">
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
            Edit Personal Info
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-8 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Update your personal information and account details.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name / Brand Name */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {formData.userType === "individual" ? "First Name" : "Brand Name"}
              </label>
            </div>
            <input
              type="text"
              placeholder={formData.userType === "individual" ? "First Name" : "Brand Name"}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name - Only show for Individual */}
          {formData.userType === "individual" && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Last Name
                </label>
              </div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          )}

          {/* Full Name - Only show for Organization */}
          {formData.userType === "organization" && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building className="w-4 h-4 text-gray-400" />
                <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Full Name
                </label>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          {/* Email Address - MASKED AND READ-ONLY */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Email Address
              </label>
            </div>
            <div
              className="w-full px-4 py-3 border border-gray-600 rounded-full text-gray-400 text-sm bg-gray-800/50"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            >
              {maskEmail(formData.email) || "Not provided"}
            </div>
            <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Email address cannot be changed for security reasons
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Phone Number
              </label>
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Location
              </label>
            </div>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
              style={{
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
              }}
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">
                Select Location
              </option>
              {nigerianStates.map((state, index) => (
                <option key={index} value={state} className="bg-gray-800 text-white">
                  {state}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.location}
              </p>
            )}
          </div>

          {/* Account Type Display (Read-only) */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-4 h-4 text-gray-400" />
              <label className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Account Type
              </label>
            </div>
            <div
              className="w-full px-4 py-3 border border-gray-600 rounded-full text-gray-400 text-sm bg-gray-800/50"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            >
              {formData.userType === "individual" ? "Individual" : "Organization"}
            </div>
            <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Account type cannot be changed after registration
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {/* Save Changes Button */}
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges()}
              className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full text-gray-400 hover:text-white py-3 font-medium transition-all duration-200 text-sm border border-gray-600 rounded-full hover:border-gray-500"
              style={{
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Changes Indicator */}
        {hasChanges() && (
          <div className="mt-4 text-center">
            <p className="text-yellow-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You have unsaved changes
            </p>
          </div>
        )}
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

export default EditInfo
