"use client"

import { useState, useEffect } from "react"
import eventBackground1 from "../../assets/images/dashboard1.png"
import eventBackground2 from "../../assets/images/dashboard2.png"
import eventBackground3 from "../../assets/images/dashboard3.png"
import eventBackground4 from "../../assets/images/dashboard4.png"
import eventBackground5 from "../../assets/images/dashboard5.png"

const SecondSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Array of 5 carousel images using imported assets
  const carouselImages = [eventBackground1, eventBackground2, eventBackground3, eventBackground4, eventBackground5]

  // Auto-change images every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
    }, 3500)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const handleExploreMore = () => {
    // Add your explore functionality here
    console.log("Explore more clicked")
  }

  return (
    <section className="bg-black py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Carousel */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden relative">
              {carouselImages.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Event scene ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 text-left sm:text-center lg:text-left">
            <h2
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Start exploring, your perfect event is waiting to be found
            </h2>

            <p
              className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666" }}
            >
              Stop scrolling and start browsing through events that speak your language, no maps, just fun.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleExploreMore}
              className="text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 block sm:inline-block"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "50px 50px 50px 0px",
              }}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecondSection
