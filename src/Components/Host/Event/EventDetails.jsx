{"use client"}

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  ArrowLeft,
  Save,
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
  const [headerImage, setHeaderImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [activeTab, setActiveTab] = useState("Event")

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

  const startDateRef = useRef(null)
  const startTimeRef = useRef(null)
  const endDateRef = useRef(null)
  const endTimeRef = useRef(null)
  const headerFileInputRef = useRef(null)
  const galleryFileInputRef = useRef(null)

  const formatDateForInput = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

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
        if (!token) throw new Error("No authentication token found")

        const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}`, {
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
        if (data.status !== "success") throw new Error(data.message || "Failed to fetch event")

        const eventData = data.data.event
        setEvent(eventData)
        setHeaderImage(eventData.headerImage || null)
        setGalleryImages(eventData.images || [])

        const startDateTime = new Date(eventData.startDateTime)
        const endDateTime = new Date(eventData.endDateTime)

        setFormData({
          eventName: eventData.eventName || "",
          eventDescription: eventData.eventDescription || "",
          eventLocation: eventData.eventLocation?.venue || "",
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
      } catch (err) {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (["startDate", "startTime", "endDate", "endTime"].includes(field)) {
      setDateTimeError("")
    }
  }

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

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const formData = new FormData()
      formData.append("eventImage", file)
      formData.append("imageType", imageType)
      formData.append("eventId", id)

      const endpoint = imageType === "header" ? "/upload-image" : "/upload-gallery"
      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.status !== "success") throw new Error(data.message || "Failed to upload image")

      if (imageType === "header") {
        setHeaderImage(data.data.imageUrl)
      } else {
        setGalleryImages((prev) => [...prev, data.data.imageUrl])
      }

      toast.success("Image uploaded successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to upload image")
    } finally {
      setIsSubmitting(false)
      if (imageType === "header" && headerFileInputRef.current) {
        headerFileInputRef.current.value = ""
      } else if (imageType === "gallery" && galleryFileInputRef.current) {
        galleryFileInputRef.current.value = ""
      }
    }
  }

 const handleImageDelete = async (imageUrl, imageType) => {
  if (imageType === "header") return; // We removed header delete

  try {
    setIsSubmitting(true);
    const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    console.log("Deleting image:", imageUrl); // Debug
    console.log("Token:", token); // Debug

    const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/delete-gallery-image`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Must be EXACT
      },
      body: JSON.stringify({
        eventId: id,
        imageUrl,
      }),
    });

    // Log response for debugging
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Error response:", errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "success") throw new Error(data.message);

    setGalleryImages((prev) => prev.filter((img) => img !== imageUrl));
    toast.success("Gallery image deleted!");
  } catch (err) {
    console.error("Delete error:", err);
    toast.error(err.message || "Failed to delete image");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleRemoveTicketTier = async (ticketId) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/tickets/${ticketId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setFormData((prev) => ({
        ...prev,
        ticketTiers: prev.ticketTiers.filter((tier) => tier.id !== ticketId),
      }))
      toast.success("Ticket tier removed successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to remove ticket tier")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const eventData = {
        eventName: formData.eventName.trim(),
        eventDescription: formData.eventDescription.trim(),
        eventLocation: {
          venue: formData.eventLocation.trim(),
          locationTips: formData.eventLocationTips.trim() || null,
        },
        eventUrl: formData.eventUrl.trim() || null,
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
        ticketTiers: formData.ticketTiers,
      }

      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}`, {
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

      toast.success("Event updated successfully!")
      setTimeout(() => navigate("/dashboard"), 2000)
    } catch (err) {
      toast.error(err.message || "Failed to update event")
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
    <div className="min-h-screen bg-black px-4 sm:px-6 py-8">
      <div className="w-full max-w-5xl mx-auto">
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
            <h1 className="text-white text-2xl font-medium truncate" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {formData.eventName || "Unnamed Event"}
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
                      You haven't added tickets to your event yet
                    </p>
                    <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {event.isPublished
                        ? "Your event is published but has no tickets. Add tickets to allow registrations."
                        : "Add tickets and set a ticket policy to publish your event."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/add-ticket/${id}`)}
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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-4 sm:gap-8 border-b border-gray-800 pb-2">
            {["Event", "Tickets", "Sales"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "Tickets") {
                    navigate(`/ticket-list/${id}`)
                  } else if (tab === "Sales") {
                    navigate(`/sales/${id}`)
                  } else {
                    setActiveTab(tab)
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  activeTab === tab
                    ? "bg-gray-800 text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-2/3 order-1">
            <h2 className="text-white text-xl font-medium mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Make changes to your event
            </h2>
            <form className="space-y-6">
              {/* Form fields remain the same as in your original code */}
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
              <div>
                <input
                  type="text"
                  placeholder="Event Venue"
                  value={formData.eventLocation}
                  onChange={(e) => handleInputChange("eventLocation", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
                />
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={() => startDateRef.current?.showPicker?.()}
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
                    onClick={() => startTimeRef.current?.showPicker?.()}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={() => endDateRef.current?.showPicker?.()}
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
                    onClick={() => endTimeRef.current?.showPicker?.()}
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
              {dateTimeError && (
                <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {dateTimeError}
                  </p>
                </div>
              )}
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
              {formData.ticketTiers.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Ticket Tiers
                  </h4>
                  {formData.ticketTiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <span className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {tier.name}: ₦{tier.price.toLocaleString()} (Qty: {tier.quantity})
                        {tier.ticketType === "Group" && `, Group Size: ${tier.groupSize}`}
                        {tier.description && <span className="text-gray-400 text-xs ml-2"> - {tier.description}</span>}
                      </span>
                      <button
                        onClick={() => handleRemoveTicketTier(tier.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate(`/add-ticket/${id}`)}
                    className="text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-sm"
                    style={{
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                    }}
                  >
                    Add Another Ticket
                  </button>
                </div>
              )}
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

          {/* Images Section */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="space-y-6">
             {/* Header Image */}
<div>
  <h3 className="text-white text-lg font-medium mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
    Header Image
  </h3>
  <div className="relative">
    {headerImage ? (
      <img
        src={headerImage}
        alt="Event header"
        className="w-full h-48 object-cover rounded-lg"
      />
    ) : (
      <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
          No header image
        </span>
      </div>
    )}
  </div>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, "header")}
    className="hidden"
    id="header-upload"
    ref={headerFileInputRef}
    disabled={isSubmitting}
  />
  <label
    htmlFor="header-upload"
    className="mt-4 block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"
  >
    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
      {headerImage ? "Replace Header Image" : "Upload Header Image"}
    </p>
  </label>
</div>

              {/* Gallery Images */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Event Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.length > 0 ? (
                    galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleImageDelete(image, "gallery")}
                          className="absolute top-2 right-2 bg-gray-900/80 p-1 rounded-full text-red-400 hover:text-red-300 transition-colors"
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        No gallery images
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "gallery")}
                  className="hidden"
                  id="gallery-upload"
                  ref={galleryFileInputRef}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="gallery-upload"
                  className="mt-4 block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Upload Gallery Image
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

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