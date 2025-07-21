"use client"

import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ArrowLeft } from "lucide-react"

const eventCategories = [
  "Music",
  "Sports",
  "Business",
  "Technology",
  "Art & Culture",
  "Food & Drink",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "Networking",
  "Other",
]

const CreateEvent = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventLocation: "",
    eventLocationTips: "",
    eventUrl: "",
    eventCategory: "",
    startDate: "",
    startTime: "",
    startPeriod: "AM",
    endDate: "",
    endTime: "",
    endPeriod: "AM",
    instagramUrl: "",
    twitterUrl: "",
    snapchatUrl: "",
    tiktokUrl: "",
    websiteUrl: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Generate dynamic URL placeholder based on event name
  const generateUrlPlaceholder = () => {
    if (formData.eventName.trim()) {
      const eventSlug = formData.eventName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .trim()
      return `https://www.genpay.ng/explore/${eventSlug}`
    }
    return "https://www.genpay.ng/explore/your-event-name"
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required"
    }

    if (!formData.eventDescription.trim()) {
      newErrors.eventDescription = "Event description is required"
    }

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = "Event location is required"
    }

    if (!formData.eventCategory) {
      newErrors.eventCategory = "Event category is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required"
    }

    // Validate URL format if provided
    const urlFields = ["eventUrl", "instagramUrl", "twitterUrl", "snapchatUrl", "tiktokUrl", "websiteUrl"]
    urlFields.forEach((field) => {
      if (formData[field] && formData[field].trim()) {
        try {
          new URL(formData[field])
        } catch {
          newErrors[field] = "Please enter a valid URL"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Get the JWT token from storage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Prepare event data for backend
      const eventData = {
        eventName: formData.eventName.trim(),
        eventDescription: formData.eventDescription.trim(),
        eventLocation: formData.eventLocation.trim(),
        eventLocationTips: formData.eventLocationTips.trim() || null,
        eventUrl: formData.eventUrl.trim() || generateUrlPlaceholder(),
        eventCategory: formData.eventCategory,
        startDateTime: `${formData.startDate} ${formData.startTime} ${formData.startPeriod}`,
        endDateTime: `${formData.endDate} ${formData.endTime} ${formData.endPeriod}`,
        socialLinks: {
          instagram: formData.instagramUrl.trim() || null,
          twitter: formData.twitterUrl.trim() || null,
          snapchat: formData.snapchatUrl.trim() || null,
          tiktok: formData.tiktokUrl.trim() || null,
          website: formData.websiteUrl.trim() || null,
        },
      }

      console.log("Creating event:", eventData)

      // Send to backend API
      const response = await axios.post("http://localhost:5000/api/events/create", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Event created successfully:", response.data)

      // Show success toast
      toast.success("Event created successfully!", {
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
        eventName: "",
        eventDescription: "",
        eventLocation: "",
        eventLocationTips: "",
        eventUrl: "",
        eventCategory: "",
        startDate: "",
        startTime: "",
        startPeriod: "AM",
        endDate: "",
        endTime: "",
        endPeriod: "AM",
        instagramUrl: "",
        twitterUrl: "",
        snapchatUrl: "",
        tiktokUrl: "",
        websiteUrl: "",
      })

      // Navigate to events dashboard after successful creation
      setTimeout(() => {
        if (onNavigate) {
          onNavigate("/dashboard")
        } else {
          window.location.href = "/dashboard"
        }
      }, 2000)
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Event creation failed:", error.response.data)

        toast.error(error.response.data.message || "Failed to create event. Please try again.", {
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

  const handleCancel = () => {
    if (onNavigate) {
      onNavigate("/dashboard")
    } else {
      window.history.back()
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


  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
           
               <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-black" />
         
            </div>
            <h1 className="text-white text-2xl font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              New Event
            </h1>
          </div>
          <p className="text-gray-400 text-xl" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Let's set your event up in no time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <p className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Let's start with your Event Name, Event Description, Event Location & Event URL
            </p>

            {/* Event Name */}
            <div>
              <input
                type="text"
                placeholder="Event Name"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.eventName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Event Description and Event Location in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <textarea
                  placeholder="Event Description"
                  value={formData.eventDescription}
                  onChange={(e) => handleInputChange("eventDescription", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm resize-none"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
                {errors.eventDescription && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.eventDescription}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={(e) => handleInputChange("eventLocation", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
                {errors.eventLocation && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.eventLocation}
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Location Tips (e.g adjacent Koko Dome, Ibadan)"
                  value={formData.eventLocationTips}
                  onChange={(e) => handleInputChange("eventLocationTips", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
              </div>
            </div>

            {/* Event URL - Responsive Layout */}
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
              {/* Non-editable URL display */}
              <div>
                <div
                  className="w-full px-4 py-3 border border-gray-600 text-gray-400 text-sm bg-gray-800/50 cursor-not-allowed"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                >
                  https://www.genpay.ng/explore/
                </div>
              </div>

              {/* Non-editable full URL display */}
              <div>
                <div
                  className="w-full px-4 py-3 border border-gray-600 text-gray-400 text-sm bg-gray-800/50 cursor-not-allowed break-all"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                >
                  {generateUrlPlaceholder()}
                </div>
              </div>
            </div>
          </div>

          {/* Category and Dates Section */}
          <div className="space-y-4">
            <p className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Now let's go on with your Event Category, Event Dates, & Event Socials
            </p>

            {/* Event Category */}
            <div>
              <select
                value={formData.eventCategory}
                onChange={(e) => handleInputChange("eventCategory", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm appearance-none"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BD6666' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 12px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "25px",
                   borderRadius: "15px 15px 15px 0px" 
                }}
              >
                <option value="" disabled className="bg-gray-800 text-gray-400">
                  Event Category
                </option>
                {eventCategories.map((category, index) => (
                  <option key={index} value={category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
              {errors.eventCategory && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.eventCategory}
                </p>
              )}
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="date"
                  placeholder="Event Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif',  borderRadius: "15px 15px 15px 0px"  }}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  placeholder="Start Time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif',  borderRadius: "15px 15px 15px 0px"   }}
                />
                {errors.startTime && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.startTime}
                  </p>
                )}
              </div>
              <div>
                <select
                  value={formData.startPeriod}
                  onChange={(e) => handleInputChange("startPeriod", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm appearance-none"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BD6666' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "25px",
                     borderRadius: "15px 15px 15px 0px"  
                  }}
                >
                  <option value="AM" className="bg-gray-800 text-white">
                    AM
                  </option>
                  <option value="PM" className="bg-gray-800 text-white">
                    PM
                  </option>
                </select>
              </div>
            </div>

            {/* End Date and Time */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="date"
                  placeholder="Event End Date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif',  borderRadius: "15px 15px 15px 0px"  }}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.endDate}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  placeholder="End Time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif',  borderRadius: "15px 15px 15px 0px"   }}
                />
                {errors.endTime && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.endTime}
                  </p>
                )}
              </div>
              <div>
                <select
                  value={formData.endPeriod}
                  onChange={(e) => handleInputChange("endPeriod", e.target.value)}
                  className="w-full px-3 py-3 bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-gray-500 transition-colors text-sm appearance-none"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BD6666' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 8px center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "25px",
                     borderRadius: "15px 15px 15px 0px"  
                  }}
                >
                  <option value="AM" className="bg-gray-800 text-white">
                    AM
                  </option>
                  <option value="PM" className="bg-gray-800 text-white">
                    PM
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Socials Section */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Socials
            </h3>

            {/* Instagram URL */}
            <div>
              <input
                type="url"
                placeholder="Instagram URL"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.instagramUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.instagramUrl}
                </p>
              )}
            </div>

            {/* X (Twitter) URL */}
            <div>
              <input
                type="url"
                placeholder="X (Twitter) URL"
                value={formData.twitterUrl}
                onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.twitterUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.twitterUrl}
                </p>
              )}
            </div>

            {/* Snapchat URL */}
            <div>
              <input
                type="url"
                placeholder="Snapchat URL"
                value={formData.snapchatUrl}
                onChange={(e) => handleInputChange("snapchatUrl", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.snapchatUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.snapchatUrl}
                </p>
              )}
            </div>

            {/* TikTok URL */}
            <div>
              <input
                type="url"
                placeholder="TikTok URL"
                value={formData.tiktokUrl}
                onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.tiktokUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.tiktokUrl}
                </p>
              )}
            </div>

            {/* Website URL */}
            <div>
              <input
                type="url"
                placeholder="Website URL"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.websiteUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.websiteUrl}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 text-gray-400 hover:text-white font-medium transition-all duration-200 text-sm border border-gray-600 rounded-lg hover:border-gray-500 bg-gray-800"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            >
              Cancel
            </button>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
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

export default CreateEvent
