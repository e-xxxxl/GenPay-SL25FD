"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  ArrowLeft,
  Save,
  Plus,
  Upload,
  X,
  Calendar,
  Clock,
  Instagram,
  Twitter,
  Camera,
  Globe,
  AlertTriangle,
  Ticket,
} from "lucide-react"

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

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateTimeError, setDateTimeError] = useState("")

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
    ticketTiers: [],
  })

  const [newTicketTier, setNewTicketTier] = useState({
    name: "",
    price: "",
    quantity: "",
  })

  const [errors, setErrors] = useState({})
  const [eventImages, setEventImages] = useState([])
  const [showTicketForm, setShowTicketForm] = useState(false)

  const startDateRef = useRef(null)
  const startTimeRef = useRef(null)
  const endDateRef = useRef(null)
  const endTimeRef = useRef(null)

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

  // Format time for input (HH:MM)
  const formatTimeForInput = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toTimeString().slice(0, 5)
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`https://genpay-sl25bd.onrender.com/api/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data.status !== "success") {
          throw new Error(data.message || "Failed to fetch event")
        }

        const eventData = data.data.event
        setEvent(eventData)

        // Parse dates
        const startDateTime = new Date(eventData.startDateTime)
        const endDateTime = new Date(eventData.endDateTime)

        setFormData({
          eventName: eventData.eventName || "",
          eventDescription: eventData.eventDescription || "",
          eventLocation: eventData.eventLocation?.venue || eventData.eventLocation || "",
          eventLocationTips: eventData.eventLocation?.locationTips || "",
          eventUrl: eventData.eventUrl || "",
          eventCategory: eventData.eventCategory || "",
          startDate: formatDateForInput(startDateTime),
          startTime: formatTimeForInput(startDateTime),
          endDate: formatDateForInput(endDateTime),
          endTime: formatTimeForInput(endDateTime),
          instagramUrl: eventData.socialLinks?.instagram || "",
          twitterUrl: eventData.socialLinks?.twitter || "",
          snapchatUrl: eventData.socialLinks?.snapchat || "",
          tiktokUrl: eventData.socialLinks?.tiktok || "",
          websiteUrl: eventData.socialLinks?.website || "",
          ticketTiers: eventData.tickets || [],
        })

        // Set event images if available
        if (eventData.images) {
          setEventImages(eventData.images)
        }
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err.message)
        if (err.message.includes("authentication") || err.message.includes("401") || err.message.includes("403")) {
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, navigate])

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

  const handleAddTicketTier = () => {
    if (newTicketTier.name && newTicketTier.price && newTicketTier.quantity) {
      setFormData((prev) => ({
        ...prev,
        ticketTiers: [...prev.ticketTiers, { ...newTicketTier, id: Date.now() }],
      }))
      setNewTicketTier({ name: "", price: "", quantity: "" })
      setShowTicketForm(false)
    }
  }

  const handleRemoveTicketTier = (id) => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((tier) => tier.id !== id),
    }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const eventData = {
        eventName: formData.eventName.trim(),
        eventDescription: formData.eventDescription.trim(),
        eventLocation: formData.eventLocation.trim(),
        eventLocationTips: formData.eventLocationTips.trim() || null,
        eventUrl: formData.eventUrl.trim(),
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
        tickets: formData.ticketTiers,
      }

      const response = await fetch(`https://genpay-sl25bd.onrender.com/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.status !== "success") {
        throw new Error(data.message || "Failed to update event")
      }

      toast.success("Event updated successfully!", {
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

      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Error updating event:", err)
      toast.error(err.message || "Failed to update event", {
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
      if (err.message.includes("authentication") || err.message.includes("401") || err.message.includes("403")) {
        navigate("/login")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    navigate("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Loading event details...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {error}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "25px",
            }}
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Event not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-4 h-4 text-black" />
            </div>
            <h1 className="text-white text-2xl font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Edit Event
            </h1>
          </div>

          {/* Ticket Notice */}
          {formData.ticketTiers.length === 0 && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Ticket className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Hi {event.createdBy?.name || "there"}, you have not added tickets to your event yet
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                    fontFamily: '"Poppins", sans-serif',
                    borderRadius: "15px 15px 15px 0px",
                  }}
                >
                  Add Tickets
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1 space-y-6">
            {/* Images Section */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Images
              </h3>
              <div className="space-y-4">
                {eventImages.length > 0 ? (
                  eventImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url || image}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KkYKKH5H6EAZTz53hX1cDlKr0NjUqq.png"
                      alt="Event poster"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Gallery
              </h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Add Image
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <h2 className="text-white text-xl font-medium mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Make changes to your event
            </h2>

            <form className="space-y-6">
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
              </div>

              {/* Event Description */}
              <div>
                <textarea
                  placeholder="Event Description"
                  value={formData.eventDescription}
                  onChange={(e) => handleInputChange("eventDescription", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm resize-none"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
              </div>

              {/* Event Location */}
              <div>
                <input
                  type="text"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={(e) => handleInputChange("eventLocation", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
              </div>

              {/* Location Tips */}
              <div>
                <input
                  type="text"
                  placeholder="Location Tips (e.g adjacent Koko Dome, Ibadan)"
                  value={formData.eventLocationTips}
                  onChange={(e) => handleInputChange("eventLocationTips", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
              </div>

              {/* Event Category */}
              <div>
                <select
                  value={formData.eventCategory}
                  onChange={(e) => handleInputChange("eventCategory", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
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
              </div>

              {/* Start Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                      colorScheme: "dark",
                    }}
                  />
                </div>

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
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                      colorScheme: "dark",
                    }}
                  />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                      colorScheme: "dark",
                    }}
                  />
                </div>

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
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                      colorScheme: "dark",
                    }}
                  />
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

              {/* Social Links */}
              <div className="space-y-4">
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
                </div>

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
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    placeholder="Snapchat URL"
                    value={formData.snapchatUrl}
                    onChange={(e) => handleInputChange("snapchatUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                  />
                </div>

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
                </div>

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
                </div>
              </div>

              {/* Ticket Tiers */}
              {formData.ticketTiers.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Ticket Tiers
                  </h4>
                  {formData.ticketTiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <span className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {tier.name}: ${tier.price} (Qty: {tier.quantity})
                      </span>
                      <button
                        onClick={() => handleRemoveTicketTier(tier.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Ticket Form */}
              {showTicketForm && (
                <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Add Ticket Tier
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Tier Name"
                      value={newTicketTier.name}
                      onChange={(e) => setNewTicketTier({ ...newTicketTier, name: e.target.value })}
                      className="px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    />
                    <input
                      type="number"
                      placeholder="Price ($)"
                      value={newTicketTier.price}
                      onChange={(e) => setNewTicketTier({ ...newTicketTier, price: e.target.value })}
                      className="px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newTicketTier.quantity}
                      onChange={(e) => setNewTicketTier({ ...newTicketTier, quantity: e.target.value })}
                      className="px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddTicketTier}
                      className="flex items-center text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-sm"
                      style={{
                        background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                        fontFamily: '"Poppins", sans-serif',
                        borderRadius: "15px 15px 15px 0px",
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Tier
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors text-sm border border-gray-600 rounded-lg hover:border-gray-500"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting || dateTimeError}
                  className="w-full py-3 text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                    fontFamily: '"Poppins", sans-serif',
                    borderRadius: "15px 15px 15px 0px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
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

export default EventDetails
