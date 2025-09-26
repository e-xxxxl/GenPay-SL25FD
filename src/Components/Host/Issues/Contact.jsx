"use client"

import { useState } from "react"
import { ArrowLeft, Send, Mail } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const issueCategories = [
  "General Inquiry",
  "Technical Support",
  "Account Issues",
  "Payment Problems",
  "Event Management",
  "Bug Report",
  "Feature Request",
  "Partnership Inquiry",
  "Billing Questions",
  "Other",
]

const Contact = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    issueCategory: "",
    message: "",
  })

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.issueCategory) {
      newErrors.issueCategory = "Please select an issue category"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Prepare the email data - sending to support@genpay.ng
      const emailData = {
        to: "support@genpay.ng",
        subject: `Contact Form: ${formData.issueCategory} - ${formData.firstName} ${formData.lastName}`,
        from: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        issueCategory: formData.issueCategory,
        message: formData.message,
        timestamp: new Date().toISOString(),
        source: "Contact Page",
      }

      // Send to backend API
      const response = await axios.post("http://localhost:5000/api/auth/send-support-message", emailData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Support message sent successfully:", response.data)

      // Show success toast
      toast.success("Message sent successfully! Our support team will get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
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

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        issueCategory: "",
        message: "",
      })
    } catch (error) {
      if (error.response) {
        console.error("Failed to send support message:", error.response.data)
        toast.error(error.response.data.message || "Failed to send message. Please try again.", {
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
      onNavigate(-1)
    } else {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
      <div className="w-full max-w-lg mx-auto">
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
            Contact Genpay Nigeria
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              />
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
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Issue Category */}
          <div>
            <select
              value={formData.issueCategory}
              onChange={(e) => handleInputChange("issueCategory", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
              style={{
                fontFamily: '"Poppins", sans-serif',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
              }}
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">
                Issue Category
              </option>
              {issueCategories.map((category, index) => (
                <option key={index} value={category} className="bg-gray-800 text-white">
                  {category}
                </option>
              ))}
            </select>
            {errors.issueCategory && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.issueCategory}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm resize-vertical"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-white text-sm mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
            For swifter response:
          </p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <a
                href="mailto:contact@genpay.ng"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                contact@genpay.ng
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <a
                href="mailto:sales@genpay.ng"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                sales@genpay.ng
              </a>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <p className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Support Team
              </p>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              All messages from this form are sent directly to{" "}
              <span className="text-purple-400 font-medium">support@genpay.ng</span>. Our support team typically
              responds within 24 hours during business days. For urgent matters, please use the direct email addresses
              above.
            </p>
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

export default Contact
