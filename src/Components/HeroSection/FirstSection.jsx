import React from 'react'

const FirstSection = () => {
  const scrollToWaitlistForm = () => {
    const element = document.getElementById("WaitlistForm")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    // <section className="bg-black md: mt-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-4xl mx-auto text-center">
    //     {/* Main Headline */}
    //     <h1
    //       className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 leading-tight"
    //       style={{ fontFamily: '"Poppins", sans-serif' }}
    //     >
    //       Discover and secure tickets to the hottest events, all in one place
    //     </h1>

    //     {/* Content Card */}
    //     <div
    //       className="rounded-2xl p-8 sm:p-10 lg:p-12 text-left mx-auto"
    //       style={{
    //         background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
    //         width: "1055px",
    //       }}
    //     >
    //       <p
    //         className="text-white text-lg sm:text-xl leading-relaxed mb-8"
    //         style={{ fontFamily: '"Poppins", sans-serif' }}
    //       >
    //         GenPay exists to power meaningful experiences through technology, trust, and vibrant human connection.
    //       </p>

    //       <p
    //         className="text-white text-lg sm:text-xl leading-relaxed mb-10"
    //         style={{ fontFamily: '"Poppins", sans-serif' }}
    //       >
    //         To redefine how people experience events by merging commerce, community, and culture – creating a limitless
    //         space where users can buy, sell, connect, and share unforgettable moments.
    //       </p>

    //       {/* CTA Button */}
    //       <button
    //         onClick={scrollToWaitlistForm}
    //         className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200"
    //         style={{ fontFamily: '"Poppins", sans-serif' }}
    //       >
    //         Start your experience
    //       </button>
    //     </div>
    //   </div>
    // </section>

     <section className="bg-black mt-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto text-center">
        {/* Main Headline */}
        <h1
          className="text-white text-2xl  sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 leading-tight px-2"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Discover and secure tickets to the hottest <br />
          <span className='md:ml-[-462px]'>events, all in one place</span>
        </h1>

        {/* Content Card */}
        <div
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 text-left mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
          style={{
            background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
          }}
        >
          <p
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Genpay exists to power meaningful experiences through technology, trust, and vibrant human connection.
          </p>

          <p
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 md:mb-10"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            To redefine how people experience events by merging commerce, community, and culture – creating a limitless
            space where users can buy, sell, connect, and share unforgettable moments.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToWaitlistForm}
            className="bg-black text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Explore now
          </button>
        </div>
      </div>
    </section>
  )
}


export default FirstSection