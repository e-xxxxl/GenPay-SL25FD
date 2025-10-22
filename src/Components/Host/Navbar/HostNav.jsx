{"use client"}

import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import genpayLogo from "../../../assets/images/genpaylogo.png" 
import { Link, useNavigate } from "react-router-dom"

const HostNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGenpayDropdownOpen, setIsGenpayDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToWaitlistForm = () => {
    const element = document.getElementById("WaitlistForm")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch("http://localhost:5000/api/host/logout", {  // Assuming logout endpoint for hosts
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setIsMenuOpen(false)
      navigate("/login")  // Navigate to login page after logout
    }
  }

  return (
    <div className="relative">
      <nav className="bg-black w-full px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center h-12">
          {" "}
          {/* Fixed height container */}
          <img
            src={genpayLogo}
            alt="GenPay Logo"
            className=" w-90 md:w-98 object-contain ml-[-90px] md:ml-0 lg:ml-auto" // Fixed height, auto width, object-contain prevents distortion
            style={{ fontFamily: '"Poppins", sans-serif'}}
          />
        </div>

       

        {/* Sign Up Button */}
        <div className="hidden lg:block">
        <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
          <button
            onClick={scrollToWaitlistForm}
            className="text-white px-6 py-2  transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius:'10px 10px 10px 0px ', // Fully rounded button
            }}
          >
            
              New Event
          </button>
          </Link>
        </div>

      {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white p-3 transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #A228AF 0%, #FF0000 100%)",
              borderRadius: "20px 10px 10px 0px",
            }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black z-50 border-t border-gray-800">
          <div className="px-6 py-4 space-y-4">
            
            <button
              onClick={handleLogout}
              className="block text-gray-400 hover:text-white py-2 w-full text-left"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Logout
            </button>
            <Link to="/create-event" style={{ textDecoration: 'none', color: 'inherit' }}>
            <button
              onClick={scrollToWaitlistForm}
              className="text-white px-6 py-2.5 rounded-full w-full font-medium transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Create New event
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default HostNav