"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Search, Calendar, Ticket, ArrowLeft } from "lucide-react"

const NotFound = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [showCountdown, setShowCountdown] = useState(false)

  // Funny 404 messages related to event ticketing
  const errorMessages = [
    "This event has been cancelled due to lack of existence",
    "Looks like you don't have VIP access to this page",
    "This page sold out faster than Taylor Swift tickets",
    "Wrong venue! This page doesn't exist in our universe",
    "Oops! This page is more elusive than front row seats",
    "404: Event Not Found - Did you check your ticket stub?",
    "This page went backstage and never came back",
    "Sorry, this URL expired faster than early bird pricing",
  ]

  const [currentMessage, setCurrentMessage] = useState(errorMessages[0])

  // Rotate through funny messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)])
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [])

  // Auto-redirect countdown
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showCountdown && countdown === 0) {
      navigate("/")
    }
  }, [countdown, showCountdown, navigate])

  const handleAutoRedirect = () => {
    setShowCountdown(true)
  }

  const quickActions = [
    {
      icon: Home,
      label: "Go Home",
      action: () => navigate("/"),
      description: "Back to the main stage",
    },
    {
      icon: Search,
      label: "Explore Events",
      action: () => navigate("/explore"),
      description: "Find your next adventure",
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Large 404 with ticket styling */}
        <div className="relative">
          <div
            className="text-8xl sm:text-9xl font-bold opacity-20 select-none"
            style={{
              fontFamily: '"Poppins", sans-serif',
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>

          {/* Ticket stub design overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="bg-white/5 border-2 border-dashed rounded-lg px-8 py-4 transform -rotate-12"
              style={{ borderColor: "#A228AF" }}
            >
              <div className="text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                ADMIT NONE
              </div>
              <div className="text-sm text-gray-400">Page Not Found</div>
            </div>
          </div>
        </div>

        {/* Rotating funny message */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Oops! Page Not Found
          </h1>

          <p
            className="text-lg text-gray-300 min-h-[3rem] flex items-center justify-center transition-all duration-500"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            {currentMessage}
          </p>
        </div>

        {/* Event-themed explanation */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Ticket className="h-5 w-5 text-pink-400" />
            <span className="text-pink-400 font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Event Details
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
            The page you're looking for seems to have been cancelled, postponed, or moved to a different venue. Don't
            worry though - there are plenty of other amazing experiences waiting for you!
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-xl p-4 transition-all duration-200 hover:scale-105"
            >
              <action.icon className="h-6 w-6 text-pink-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-white font-medium text-sm mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {action.label}
              </div>
              <div className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {action.description}
              </div>
            </button>
          ))}
        </div>

        {/* Auto-redirect option */}
        <div className="space-y-4">
          {!showCountdown ? (
            <button
              onClick={handleAutoRedirect}
              className="text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Take me home automatically
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Redirecting to home in {countdown} seconds...
              </p>
              <button
                onClick={() => setShowCountdown(false)}
                className="text-pink-400 hover:text-pink-300 transition-colors text-sm underline underline-offset-2"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Cancel redirect
              </button>
            </div>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>

        {/* Fun footer message */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
            💡 Pro tip: Double-check your URL like you'd double-check your event date!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
