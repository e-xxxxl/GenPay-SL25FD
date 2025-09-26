"use client"
import dash1 from "../../assets/images/dashboard5.png"
import dash2 from "../../assets/images/about1.png"
import dash3 from "../../assets/images/about2.png"
import dash4 from "../../assets/images/about3.png"
import dash5 from "../../assets/images/about4.png"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-black text-white">
        <Navbar/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Our Story Section */}
        <section className="mb-16 lg:mb-24">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Our Story
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={dash1} alt="Founder of GenPay" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Founded by creatives in Nigeria
              </h3>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666" }}>
                  GenPay was born from a simple idea: to create a space for both event creators and event attendees to
                  connect, discover, and celebrate together. We're not just building a platform; we're building your
                  next ticket out.
                </p>

                <p style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666"  }}>
                  We are built by creatives as a community. A free way to explore, connect, and celebrate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Our Values
          </h2>

          <div className="space-y-12 lg:space-y-16">
            {/* Value 1: Unconventional Creativity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Number and Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    01
                  </span>
                  <div>
                    <p
                      className="text-sm text-gray-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      UNCONVENTIONAL CREATIVITY
                    </p>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  STAND OUT
                  <br />
                  CREATIVITY
                </h3>

                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Creativity fuels everything we do. It's not just a skill; it's a way of thinking. We help event
                  organizers stand out from the crowd with innovative solutions that capture attention and create
                  lasting impressions in the digital landscape.
                </p>
              </div>

              {/* Image */}
              <div className="order-first lg:order-last">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={dash2}
                    alt="Creative event with colorful lighting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Value 2: Possibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={dash3}
                    alt="Person with afro silhouette against warm lighting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Number and Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    02
                  </span>
                  <div>
                    <p
                      className="text-sm text-gray-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      POSSIBILITY
                    </p>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  DRIVEN BY
                  <br />
                  POSSIBILITY
                </h3>

                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  We believe in the power of "what if." Every event starts with a dream, and we're here to help turn
                  those dreams into realities. From intimate gatherings to large-scale celebrations, we see potential in
                  every vision.
                </p>
              </div>
            </div>

            {/* Value 3: Trust */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Number and Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    03
                  </span>
                  <div>
                    <p
                      className="text-sm text-gray-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      TRUST
                    </p>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  BUILT ON
                  <br />
                  TRUST
                </h3>

                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Every big vision needs trust. We believe in building trust between event creators and attendees
                  through transparent records, secure payment processes, and ensuring that both parties feel confident
                  in every transaction and interaction.
                </p>
              </div>

              {/* Image */}
              <div className="order-first lg:order-last">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={dash4}
                    alt="Person with dreadlocks in red lighting representing trust"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Value 4: Tribe First */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={dash5}
                    alt="Black and white image of people at an event gathering"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Number and Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    04
                  </span>
                  <div>
                    <p
                      className="text-sm text-gray-400 uppercase tracking-wider mb-1"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      TRIBE FIRST
                    </p>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  THE TRIBE
                  <br />
                  FACTOR
                </h3>

                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  We understand that every user wants to feel like they belong. Community is at the heart of everything
                  we do. We're not just creating events; we're building connections and ensuring people feel part of
                  something bigger.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mt-16 lg:mt-24">
          <div className="max-w-4xl mx-auto">
            <div
              className="text-center text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed p-8 rounded-2xl"
              style={{
                fontFamily: '"Poppins", sans-serif',
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Genpay exists to power meaningful experiences through technology, trust, and vibrant human connection. To
              redefine how people experience events by merging commerce, community, and culture — creating a seamless
              space where users can buy, sell, connect, and share unforgettable moments.
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 lg:mt-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Ready to bring your event to life?
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Join thousands of creators who trust GenPay to make their events unforgettable.
            </p>

            <button
              className="text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 text-lg"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "50px 50px 50px 0px",
              }}
              onClick={() => {
                window.location.href = "/signup"
              }}
            >
              Get Started Today
            </button>
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  )
}

export default AboutUs
