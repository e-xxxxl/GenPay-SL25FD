"use client"

import { useState, useEffect } from "react"
import { Edit, CreditCard, User, Mail, Phone, MapPin, Building } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Account = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payoutInfo, setPayoutInfo] = useState(null)
  const navigate = useNavigate()

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
        // Get the JWT token from storage
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }
        // Fetch user profile data
        const userResponse = await axios.get("https://genpay-sl25bd.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(userResponse.data.data.user)
        // Fetch payout information
        try {
          const payoutResponse = await axios.get("https://genpay-sl25bd.onrender.com/api/user/payout-info", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setPayoutInfo(payoutResponse.data.data)
        } catch (payoutError) {
          // Payout info might not exist yet, that's okay
          console.log("No payout info found:", payoutError.response?.data?.message)
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data")
        console.error("Error fetching user data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleEditPersonalInfo = () => {
    // Navigate to edit profile page or open modal
    navigate("/account/edit")
    console.log("Edit personal info clicked")
    // You can implement navigation or modal here
  }

  const handleAddPayoutInfo = () => {
    // Navigate to payout setup page or open modal
    console.log("Add payout info clicked")
    // You can implement navigation or modal here
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
      <div className="bg-black min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center py-12">{getLoadingAnimation()}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div
              className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3"
              style={{ borderRadius: "10px" }}
            >
              <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Personal Information
            </h2>
            <div className="space-y-4">
              {/* First Name */}
              {user?.userType === "individual" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      First Name: <span className="text-white">{user?.firstName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {/* BRAND NAME */}
              {user?.userType === "organization" && (
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Organization Name: <span className="text-white">{user?.organizationName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {/* Last Name - Only show for individuals */}
              {user?.userType === "individual" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Last Name: <span className="text-white">{user?.lastName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {/* Full Name - Only show for organizations */}
              {user?.userType === "organization" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Full Name: <span className="text-white">{user?.fullName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {/* Email Address - MASKED */}
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Email Address: <span className="text-white">{maskEmail(user?.email) || "Not provided"}</span>
                  </p>
                </div>
              </div>
              {/* Phone Number */}
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Phone Number: <span className="text-white">{user?.phoneNumber || "Not provided"}</span>
                  </p>
                </div>
              </div>
              {/* Location */}
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Location: <span className="text-white">{user?.location || "Not provided"}</span>
                  </p>
                </div>
              </div>
              {/* User Type */}
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Account Type: <span className="text-white capitalize">{user?.userType || "Not specified"}</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Edit Personal Info Button */}
            <button
              onClick={handleEditPersonalInfo}
              className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Personal Info
            </button>
          </div>
          {/* Payout Information Section */}
          <div className="space-y-6">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Payout Information
            </h2>
            {payoutInfo ? (
              <div className="space-y-4">
                {/* Bank Name */}
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Bank Name: <span className="text-white">{payoutInfo.bankName}</span>
                    </p>
                  </div>
                </div>
                {/* Account Number */}
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Account Number: <span className="text-white">{payoutInfo.accountNumber}</span>
                    </p>
                  </div>
                </div>
                {/* Account Name */}
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Account Name: <span className="text-white">{payoutInfo.accountName}</span>
                    </p>
                  </div>
                </div>
                {/* Edit Payout Info Button */}
                <button
                  onClick={handleAddPayoutInfo}
                  className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                    fontFamily: '"Poppins", sans-serif',
                    borderRadius: "15px 15px 15px 0px",
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Payout Info
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No payout information added yet.
                </p>
                {/* Add Payout Info Button */}
                <button
                  onClick={handleAddPayoutInfo}
                  className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                    fontFamily: '"Poppins", sans-serif',
                    borderRadius: "15px 15px 15px 0px",
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payout Info
                </button>
              </div>
            )}
          </div>
          {/* Account Status */}
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Account Status
            </h2>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${user?.isVerified ? "bg-green-500" : "bg-yellow-500"}`} />
              <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Email Status:{" "}
                <span className={`${user?.isVerified ? "text-green-400" : "text-yellow-400"}`}>
                  {user?.isVerified ? "Verified" : "Pending Verification"}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Account Status: <span className="text-green-400">Active</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
