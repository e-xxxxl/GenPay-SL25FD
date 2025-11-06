"use client"

import { useState, useEffect, useRef } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { ArrowLeft, Camera, Globe, Instagram, Twitter, Calendar, Clock, AlertTriangle } from "lucide-react"

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Format date for input (YYYY-MM-DD)
const formatDateForInput = (date) => {
  if (!date) return ""
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}

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
  "Religious",
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
    endDate: "",
    endTime: "",
    instagramUrl: "",
    twitterUrl: "",
    snapchatUrl: "",
    tiktokUrl: "",
    websiteUrl: "",
  })

  const [errors, setErrors] = useState({})
  const [dateTimeError, setDateTimeError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startDateRef = useRef(null)
  const startTimeRef = useRef(null)
  const endDateRef = useRef(null)
  const endTimeRef = useRef(null)

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear dateTimeError when user changes date/time fields
    if (["startDate", "startTime", "endDate", "endTime"].includes(field)) {
      setDateTimeError("")
    }
  }

  // Validate date and time
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        setDateTimeError("Invalid date or time format. Please use the provided inputs.")
        return
      }

      if (endDateTime <= startDateTime) {
        setDateTimeError("End date and time must be after the start date and time.")
      } else {
        setDateTimeError("")
      }
    } else {
      setDateTimeError("")
    }
  }, [formData.startDate, formData.startTime, formData.endDate, formData.endTime])

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

    if (dateTimeError) {
      newErrors.dateTime = dateTimeError
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
        startDateTime: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
        endDateTime: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
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
      const response = await axios.post("https://genpay-sl25bd-1.onrender.com/api/events/create", eventData, {
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
        endDate: "",
        endTime: "",
        instagramUrl: "",
        twitterUrl: "",
        snapchatUrl: "",
        tiktokUrl: "",
        websiteUrl: "",
      })

      // Navigate to upload event image after successful creation
      setTimeout(() => {
        if (onNavigate) {
          onNavigate("/create-event/upload-event-image", { eventId: response.data.data.event._id })
        } else {
          window.location.href = `/create-event/upload-event-image?eventId=${response.data.data.event._id}`
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
        maxLength={100}
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
          maxLength={500}
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
          maxLength={200}
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
          maxLength={200}
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

    {/* Start Date and Time */}
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-orange-500 text-sm">*</span>
        <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Start date
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date Input */}
        <div className="relative">
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => startDateRef.current?.showPicker?.() || startDateRef.current?.click()}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={startDateRef}
            type="date"
            value={formData.startDate}
            min={formatDateForInput(new Date())}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            style={{
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
              colorScheme: "dark",
            }}
          />
          {!formData.startDate && (
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
              Start Date
            </div>
          )}
          {errors.startDate && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {errors.startDate}
            </p>
          )}
        </div>

        {/* Start Time Input */}
        <div className="relative">
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => startTimeRef.current?.showPicker?.() || startTimeRef.current?.click()}
          >
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={startTimeRef}
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
            style={{
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
              colorScheme: "dark",
            }}
          />
          {!formData.startTime && (
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
              Start Time
            </div>
          )}
          {errors.startTime && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {errors.startTime}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* End Date and Time */}
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-orange-500 text-sm">*</span>
        <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
          End date
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* End Date Input */}
        <div className="relative">
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => endDateRef.current?.showPicker?.() || endDateRef.current?.click()}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={endDateRef}
            type="date"
            value={formData.endDate}
            min={formData.startDate || formatDateForInput(new Date())}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            style={{
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
              colorScheme: "dark",
            }}
          />
          {!formData.endDate && (
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
              {formData.startDate ? "End Date" : "Select start date first"}
            </div>
          )}
          {errors.endDate && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {errors.endDate}
            </p>
          )}
        </div>

        {/* End Time Input */}
        <div className="relative">
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => endTimeRef.current?.showPicker?.() || endTimeRef.current?.click()}
          >
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={endTimeRef}
            type="time"
            value={formData.endTime}
            min={
              formData.startDate && formData.endDate && formData.startDate === formData.endDate
                ? formData.startTime
                : undefined
            }
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
            style={{
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
              colorScheme: "dark",
            }}
          />
          {!formData.endTime && (
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
              End Time
            </div>
          )}
          {errors.endTime && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {errors.endTime}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Date/Time Error */}
    {dateTimeError && (
      <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
          {dateTimeError}
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
        maxLength={255}
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
        maxLength={255}
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
        <Camera className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="url"
        placeholder="Snapchat URL"
        value={formData.snapchatUrl}
        onChange={(e) => handleInputChange("snapchatUrl", e.target.value)}
        maxLength={255}
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
        maxLength={255}
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
        maxLength={255}
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
      disabled={isSubmitting || dateTimeError}
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
