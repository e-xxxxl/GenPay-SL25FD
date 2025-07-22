"use client"

import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ArrowLeft, Camera, Globe, Instagram, Twitter, Calendar, Clock, AlertTriangle } from "lucide-react"

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
  const [dateWarning, setDateWarning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Validate date and time logic
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate} ${formData.startTime} ${formData.startPeriod}`)
      const endDateTime = new Date(`${formData.endDate} ${formData.endTime} ${formData.endPeriod}`)

      if (endDateTime <= startDateTime) {
        setDateWarning("Your end date and time cannot be before or the same as your start date and time")
      } else {
        setDateWarning("")
      }
    } else {
      setDateWarning("")
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
    formData.startPeriod,
    formData.endPeriod,
  ])

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

    // Check for date/time validation
    if (dateWarning) {
      newErrors.dateTime = dateWarning
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
      const response = await axios.post("https://genpay-sl25bd.onrender.com/api/events/create", eventData, {
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
          onNavigate("/create-event/upload-event-image")
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
            <div className="grid gap-3">
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
            <div className="space-y-3">
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
          <div className="space-y-6">
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
                  borderRadius: "15px 15px 15px 0px",
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

            {/* Start Date Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 text-sm">*</span>
                <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Start date
                </h4>
              </div>

              {/* Start Date Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                  placeholder="Start Date"
                />
                {errors.startDate && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* Start Time and Period */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
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
                    className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BD6666' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "20px",
                      borderRadius: "15px 15px 15px 0px",
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

            {/* End Date Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 text-sm">*</span>
                <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  End date
                </h4>
              </div>

              {/* End Date Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                  placeholder="End Date"
                />
                {errors.endDate && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {errors.endDate}
                  </p>
                )}
              </div>

              {/* End Time and Period */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
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
                    className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BD6666' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "20px",
                      borderRadius: "15px 15px 15px 0px",
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

            {/* Date Warning */}
            {dateWarning && (
              <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {dateWarning}
                </p>
              </div>
            )}
          </div>

          {/* Socials Section */}
          <div className="space-y-4">
            <h3 className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Socials
            </h3>

            {/* Instagram URL */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Instagram className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="Instagram URL"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.instagramUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.instagramUrl}
                </p>
              )}
            </div>

            {/* X (Twitter) URL */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Twitter className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="X (Twitter) URL"
                value={formData.twitterUrl}
                onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.twitterUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.twitterUrl}
                </p>
              )}
            </div>

            {/* Snapchat URL */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><g fill-rule="nonzero"><path fill="#fff" d="M496.27 378.17c-2.1-6.96-12.17-11.86-12.17-11.86h.01c-.93-.52-1.79-.96-2.51-1.3-16.75-8.11-31.58-17.83-44.09-28.9-10.05-8.88-18.65-18.68-25.57-29.1-8.43-12.71-12.38-23.32-14.1-29.07-.94-3.74-.79-5.23 0-7.18.67-1.63 2.58-3.22 3.52-3.93 5.67-4 14.77-9.9 20.36-13.52 4.84-3.13 9.01-5.84 11.44-7.53 7.87-5.5 13.24-11.1 16.42-17.13 4.12-7.81 4.6-16.41 1.4-24.87-4.32-11.41-14.97-18.22-28.49-18.22-3.02 0-6.1.34-9.18 1.01-7.74 1.68-15.1 4.43-21.26 6.83a.666.666 0 01-.91-.65c.66-15.25 1.38-35.73-.31-55.22-1.52-17.61-5.14-32.45-11.07-45.38-5.96-12.99-13.68-22.62-19.74-29.55-5.79-6.62-15.91-16.35-31.2-25.1-21.53-12.32-46.03-18.56-72.82-18.56-26.72 0-51.2 6.24-72.76 18.56-16.18 9.24-26.53 19.7-31.25 25.1-6.06 6.93-13.79 16.56-19.75 29.55-5.93 12.93-9.55 27.77-11.07 45.38-1.69 19.53-1.01 38.39-.31 55.21.02.49-.46.84-.92.66-6.15-2.4-13.52-5.15-21.25-6.83-3.07-.67-6.16-1.01-9.18-1.01-13.52 0-24.17 6.81-28.49 18.22-3.2 8.46-2.71 17.06 1.4 24.87 3.18 6.03 8.56 11.63 16.42 17.13 2.43 1.69 6.61 4.4 11.44 7.53 5.48 3.55 14.32 9.28 20.01 13.27.7.5 3.09 2.31 3.86 4.18.81 2 .95 3.51-.08 7.48-1.76 5.81-5.72 16.28-14 28.77-6.92 10.42-15.53 20.22-25.58 29.1-12.51 11.07-27.34 20.79-44.09 28.9-.78.38-1.73.86-2.76 1.45v-.01s-9.99 5.12-11.88 11.72c-2.79 9.75 4.63 18.88 12.23 23.78 12.4 8 27.5 12.3 36.26 14.63 2.44.65 4.65 1.24 6.66 1.87 1.26.42 4.41 1.61 5.76 3.34 1.7 2.18 1.9 4.9 2.51 7.94.98 5.13 3.11 11.51 9.46 15.89 6.98 4.83 15.85 5.17 27.08 5.6 11.75.45 26.37 1.01 43.1 6.53 7.75 2.56 14.78 6.88 22.91 11.88 16.99 10.44 38.14 23.43 74.27 23.43 36.15 0 57.44-13.06 74.55-23.56 8.08-4.96 15.06-9.25 22.64-11.75 16.73-5.53 31.35-6.08 43.1-6.53 11.22-.43 20.09-.77 27.08-5.6 6.79-4.69 8.76-11.68 9.64-16.97.48-2.6.81-4.94 2.31-6.86 1.27-1.64 4.18-2.8 5.56-3.27 2.06-.65 4.35-1.27 6.88-1.94 8.76-2.33 19.73-5.11 33.1-12.66 15.98-9.03 17.07-20.24 15.41-25.75z"/><path d="M474.29 391.99c-21.88 12.07-36.44 10.79-47.75 18.07-9.61 6.18-3.93 19.53-10.91 24.35-8.57 5.93-33.95-.43-66.7 10.4-27.02 8.93-44.27 34.62-92.91 34.62-48.75 0-65.49-25.57-92.91-34.62-32.76-10.82-58.13-4.47-66.71-10.4-6.97-4.82-1.29-18.17-10.9-24.35-11.31-7.28-25.87-6-47.75-18.07-13.94-7.7-6.04-12.46-1.39-14.71 79.28-38.38 91.92-97.64 92.49-102.1.68-5.33 1.44-9.51-4.42-14.93-5.67-5.24-30.8-20.79-37.76-25.65-11.54-8.05-16.62-16.11-12.88-26 2.59-6.83 8.99-9.41 15.74-9.41 2.1 0 4.23.25 6.28.7 12.67 2.75 24.97 9.09 32.08 10.81.97.24 1.84.35 2.61.35 3.78 0 5.12-1.91 4.87-6.25-.81-13.85-2.78-40.86-.6-66.09 3-34.71 14.19-51.92 27.5-67.13 6.39-7.31 36.38-39.01 93.75-39.01 57.52 0 87.36 31.7 93.75 39.01 13.31 15.21 24.5 32.42 27.5 67.13 2.18 25.23.3 52.25-.6 66.09-.29 4.56 1.08 6.25 4.87 6.25.77 0 1.64-.11 2.61-.35 7.11-1.72 19.41-8.06 32.08-10.81 2.05-.45 4.18-.7 6.28-.7 6.74 0 13.15 2.58 15.74 9.41 3.74 9.89-1.34 17.95-12.88 26-6.97 4.86-32.09 20.41-37.76 25.65-5.86 5.42-5.1 9.6-4.42 14.93.57 4.46 13.21 63.72 92.49 102.1 4.65 2.25 12.55 7.01-1.39 14.71zM268.94 4.4h-25.83c-24.4 1.74-46.98 8.47-67.29 20.08-17.18 9.81-28.57 20.78-35.11 28.25-15.7 17.97-30.75 40.52-34.46 83.51-1.06 12.22-1.32 24.73-1.14 36.43-1.06-.27-2.13-.52-3.22-.76-4.11-.89-8.27-1.35-12.36-1.35-19.71 0-36 10.7-42.51 27.91-4.7 12.42-3.93 25.62 2.15 37.17 4.33 8.2 11.23 15.54 21.11 22.43 2.63 1.84 6.71 4.48 11.86 7.83 2.79 1.8 6.86 4.44 10.86 7.08.6.42 2.76 1.99 3.48 3.49.82 1.71.85 3.57-.38 6.97-2.12 4.67-5.14 10.36-9.44 16.65-12.74 18.64-30.97 34.44-54.26 47.05-12.34 6.57-25.16 10.91-30.57 25.62C.61 376.06 0 379.49 0 382.97c.01 8.23 3.5 16.7 10.79 24.19l.01-.02c3.41 3.67 7.7 6.92 13.11 9.91 12.71 7.01 23.51 10.45 32.01 12.81 1.49.44 4.95 1.56 6.46 2.89 3.78 3.3 3.24 8.29 8.29 15.58 3.04 4.54 6.57 7.63 9.46 9.63 10.57 7.31 22.45 7.76 35.03 8.24 11.37.44 24.26.93 38.97 5.79 6.1 2.02 12.43 5.91 19.77 10.42 15.79 9.7 36.82 22.62 70.09 25.19h24.03c33.32-2.58 54.49-15.56 70.39-25.32 7.28-4.47 13.58-8.33 19.5-10.29 14.72-4.86 27.6-5.36 38.97-5.79 12.58-.48 24.45-.93 35.03-8.24 3.32-2.3 7.48-6.03 10.78-11.75 3.62-6.15 3.53-10.49 6.93-13.46 1.39-1.22 4.43-2.27 6.07-2.77 8.57-2.36 19.52-5.8 32.44-12.93 5.73-3.17 10.22-6.62 13.73-10.56l.13-.16c9.72-10.47 12.17-22.74 8.18-33.57-3.56-9.68-10.33-14.86-18.05-19.15a60.28 60.28 0 00-3.87-2.05c-2.31-1.18-4.66-2.34-7-3.56-24.06-12.75-42.84-28.84-55.88-47.91-4.39-6.44-7.46-12.25-9.58-16.98-1.11-3.19-1.06-4.99-.27-6.64.61-1.26 2.22-2.56 3.08-3.2 4.13-2.73 8.41-5.51 11.29-7.37 5.16-3.35 9.23-5.99 11.87-7.83 9.88-6.89 16.78-14.23 21.1-22.43 6.09-11.55 6.86-24.75 2.16-37.17-6.51-17.21-22.8-27.91-42.51-27.91-4.09 0-8.24.46-12.36 1.35-1.09.24-2.16.49-3.22.76.17-11.7-.08-24.21-1.14-36.43-3.71-42.99-18.76-65.54-34.47-83.51-6.54-7.49-17.94-18.47-35.04-28.25-20.29-11.6-42.89-18.34-67.34-20.08z"/></g></svg>
              </div>
              <input
                type="url"
                placeholder="Snapchat URL"
                value={formData.snapchatUrl}
                onChange={(e) => handleInputChange("snapchatUrl", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.snapchatUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.snapchatUrl}
                </p>
              )}
            </div>

            {/* TikTok URL */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="TikTok URL"
                value={formData.tiktokUrl}
                onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.tiktokUrl && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.tiktokUrl}
                </p>
              )}
            </div>

            

            {/* Website URL */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="Website URL"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
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
              disabled={isSubmitting || dateWarning}
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
