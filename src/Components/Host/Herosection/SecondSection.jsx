"use client"

import { useState } from "react"

const SecondSection = ({ activeTab = "Dashboard", onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "payout", label: "Payout", path: "/payout" },
    { id: "control-panel", label: "Control Panel", path: "/control-panel" },
    { id: "logs", label: "Logs", path: "/logs" },
    { id: "settings", label: "Settings", path: "/settings" },
  ]

  const handleTabClick = (item) => {
    setCurrentTab(item.label)

    // Call parent callback if provided
    if (onTabChange) {
      onTabChange(item)
    }

    // Handle navigation - you can customize this based on your routing setup
    console.log(`Navigating to: ${item.path}`)

    // For client-side routing, you might use:
    // navigate(item.path) // if using React Router
    // router.push(item.path) // if using Next.js router
  }

  const isActive = (itemLabel) => {
    return currentTab.toLowerCase() === itemLabel.toLowerCase()
  }

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-90 ${
                isActive(item.label)
                  ? "text-white"
                  : "text-gray-300 border border-gray-600 hover:border-gray-500 hover:text-white"
              }`}
              style={{
                background: isActive(item.label) ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "transparent",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Optional: Tab Content Area */}
        <div className="mt-6 sm:mt-8">
          {/* You can add tab-specific content here */}
          <div className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Current section: <span className="text-white font-medium">{currentTab}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecondSection
