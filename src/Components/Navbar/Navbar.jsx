"use client"

import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import genpayLogo from "../../assets/images/genpaylogo.png" 
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGenpayDropdownOpen, setIsGenpayDropdownOpen] = useState(false)

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
            className="h-48 md:h-48 w-auto object-contain" // Fixed height, auto width, object-contain prevents distortion
            style={{ fontFamily: '"Poppins", sans-serif' }}
          />
        </div>

        {/* Desktop Navigation */}
        <div className=" hidden lg:flex items-center space-x-8">
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Explore
          </a>
          <div className="relative">
            <button
              onClick={() => setIsGenpayDropdownOpen(!isGenpayDropdownOpen)}
              className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Genpay
              <ChevronDown className="w-4 h-4" />
            </button>
            {isGenpayDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-md shadow-lg py-2 min-w-[180px] z-50">
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                  About Us 
                </a>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                  Get in Touch
                </a>
              </div>
            )}
          </div>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Login
          </a>
        </div>

        {/* Sign Up Button */}
        <div className="hidden lg:block">
          <button
            onClick={scrollToWaitlistForm}
            className="text-white px-6 py-2  transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius:'10px 10px 10px 0px ', // Fully rounded button
            }}
          >
            <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              Sign Up
            </Link>
          </button>
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
            <a
              href="#"
              className="block text-gray-400 hover:text-white py-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-400 hover:text-white py-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Explore
            </a>
            <div className="py-2">
              <button
                onClick={() => setIsGenpayDropdownOpen(!isGenpayDropdownOpen)}
                className="text-gray-400 hover:text-white flex items-center gap-1 w-full text-left"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Genpay
                <ChevronDown className="w-4 h-4" />
              </button>
              {isGenpayDropdownOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <a href="#" className="block text-gray-300 hover:text-white py-1">
                    About Us
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white py-1">
                    Get in Touch
                  </a>
                </div>
              )}
            </div>
            <a
              href="#"
              className="block text-gray-400 hover:text-white py-2"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Login
            </a>
            <button
              onClick={scrollToWaitlistForm}
              className="text-white px-6 py-2.5 rounded-full w-full font-medium transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
