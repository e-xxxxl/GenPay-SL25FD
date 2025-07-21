import React from 'react'
import eventBackground from "../../assets/images/dashboard1.png" // Adjust the path as necessary

const SecondSection = () => {
  const handleExploreMore = () => {
    // Add your explore functionality here
    console.log("Explore more clicked")
  }

  return (
    <section className="bg-black py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Background Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden">
              <img
                src={eventBackground || "/placeholder.svg?height=400&width=600"}
                alt="People enjoying an event"
                className="w-full h-full object-cover"
              />
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