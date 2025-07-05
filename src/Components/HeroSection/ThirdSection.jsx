import React from 'react'

const ThirdSection = () => {
  const handleCreateEvent = () => {
    // Add your create event functionality here
    console.log("Create your first event clicked")
  }

  return (
    <section className="bg-black py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h2
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Skip the lines, score the vibes. Buy and sell event tickets with just a tap
        </h2>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666" }}
        >
          No more waiting in crowded queues. Connect with fellow event-goers and make memories that last a lifetime.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleCreateEvent}
          className="text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 block sm:inline-block"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                 borderRadius: "50px 50px 50px 0px",
              }}
        >
          Create your first event
        </button>
      </div>
    </section>
  )
}


export default ThirdSection