"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const FirstSection = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the JWT token from storage
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await axios.get("https://genpay-sl25bd.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser(response.data.data.user)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data")
        console.error("Error fetching user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const getGreeting = () => {
    if (loading) return "Loading..."
    if (error) return "Welcome Guest, Good Afternoon"
    if (!user) return "Welcome Guest, Good Afternoon"

    const time = new Date().getHours()
    let greeting = "Morning"
    if (time >= 12 && time < 18) greeting = "Afternoon"
    else if (time >= 18) greeting = "Evening"

    let name = "Guest"
    if (user.userType === "individual") {
      name = user.firstName
    } else {
      name = user.fullName || user.organizationName || user.firstName
    }

    return `Welcome ${name}, Good ${greeting}.`
  }

  const getLoadingAnimation = () => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div
            className="w-1 h-1 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "0ms",
            }}
          />
          <div
            className="w-1 h-1 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "150ms",
            }}
          />
          <div
            className="w-1 h-1 rounded-full animate-bounce"
            style={{
              backgroundColor: "#A228AF",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black mt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl">
        {/* Main Greeting */}
        <div className="mb-4 sm:mb-6 ">
          {loading ? (
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 leading-tight px-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {getLoadingAnimation()}
            </h1>
          ) : (
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10 md:mb-12 leading-tight px-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {getGreeting()}
            </h1>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 px-2">
            <div
              className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3"
              style={{ borderRadius: "10px" }}
            >
              <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FirstSection
