"use client"

import { useState } from "react"
import { ShoppingBag, Bell, Mail } from "lucide-react"
import SecondSection from "../Herosection/SecondSection"

const Shop = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNotifyMe = async (e) => {
    e.preventDefault()

    if (!email.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call for email subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubscribed(true)
      setEmail("")

      console.log("Email subscribed for shop notifications:", email)
    } catch (error) {
      console.error("Failed to subscribe:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Navigation Section */}
      

      {/* Shop Content */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-white text-2xl sm:text-3xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Shop
            </h1>

            <p className="text-gray-400 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
              This feature is coming soon
            </p>

            <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              We're working hard to bring you an amazing shopping experience. You will get notified when our shop goes live!
            </p>
          </div>

       
          {/* Coming Soon Features */}
          <div className="pt-8 border-t border-gray-800">
            <h3 className="text-white text-sm font-medium mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              What to expect:
            </h3>

            <div className="grid grid-cols-1 gap-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Event merchandise and branded items
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Exclusive artist collaborations
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Limited edition collectibles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
