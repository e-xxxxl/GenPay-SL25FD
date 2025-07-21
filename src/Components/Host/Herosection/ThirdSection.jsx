"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Plus, Calendar, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"

const ThirdSection = ({ onCreateEvent, onEventClick }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Mock events data - replace with actual API call
  const mockEvents = [
    {
      id: 1,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-02-15",
      location: "Lagos, Nigeria",
      attendees: 150,
      category: "Music",
    },
    {
      id: 2,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-02-20",
      location: "Abuja, Nigeria",
      attendees: 200,
      category: "Music",
    },
    {
      id: 3,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-02-25",
      location: "Port Harcourt, Nigeria",
      attendees: 120,
      category: "Music",
    },
    {
      id: 4,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-03-01",
      location: "Kano, Nigeria",
      attendees: 180,
      category: "Music",
    },
    {
      id: 5,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-03-05",
      location: "Ibadan, Nigeria",
      attendees: 160,
      category: "Music",
    },
    {
      id: 6,
      title: "Afro Is Home",
      image: "/placeholder.svg?height=120&width=200",
      date: "2024-03-10",
      location: "Enugu, Nigeria",
      attendees: 140,
      category: "Music",
    },
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, randomly show events or empty state
        // Replace this with actual API call
        const shouldShowEvents = Math.random() > 0.3 // 70% chance to show events

        if (shouldShowEvents) {
          setEvents(mockEvents)
        } else {
          setEvents([])
        }
      } catch (err) {
        setError("Failed to fetch events")
        console.error("Error fetching events:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleCreateEvent = () => {
    if (onCreateEvent) {
      onCreateEvent()
    } else {
      // Default navigation to create event page
      console.log("Navigate to create event page")
    }
  }

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event)
    } else {
      console.log("Event clicked:", event.title)
    }
  }

  const handleEventMenu = (event, action) => {
    console.log(`${action} event:`, event.title)
    // Handle edit, delete, duplicate, etc.
  }

  const categories = ["All", "Music", "Sports", "Business", "Technology", "Art"]

  const filteredEvents = events.filter((event) => selectedCategory === "All" || event.category === selectedCategory)

  // Loading state
  if (loading) {
    return (
      <div className="bg-black px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Events
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse" style={{ borderRadius: "10px" }}>
                <div className="bg-gray-700 h-24 rounded mb-3"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && events.length === 0) {
    return (
      <div className="bg-black px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl">
          <div className="text-center space-y-6">
            <p className="text-white text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You haven't created any event
            </p>
            <button
              onClick={handleCreateEvent}
              className="text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              New Event
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Events grid
  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Events
          </h2>

          {/* Categories Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Categories
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-gray-400"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer group"
              style={{ borderRadius: "10px" }}
              onClick={() => handleEventClick(event)}
            >
              {/* Event Image */}
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-24 sm:h-28 object-cover"
                />
                {/* Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEventMenu(event, "menu")
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Event Details */}
              <div className="p-4">
                <h3
                  className="text-white font-medium mb-2 group-hover:text-gray-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {event.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-center text-gray-400 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span style={{ fontFamily: '"Poppins", sans-serif' }}>{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-400 text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    <span style={{ fontFamily: '"Poppins", sans-serif' }}>{event.attendees} attendees</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Event Button (when events exist) */}
        <div className="mt-8 text-center">
          <button
            onClick={handleCreateEvent}
            className="inline-flex items-center text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <Link to="/create-event">Create New Event</Link>

          </button>
        </div>
      </div>
    </div>
  )
}

export default ThirdSection
