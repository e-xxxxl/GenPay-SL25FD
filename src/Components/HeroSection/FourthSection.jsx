"use client"



import { useState } from "react"

const FourthSection = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Add your newsletter subscription logic here
    try {
      console.log("Subscribing email:", email)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form on success
      setEmail("")
      alert("Successfully subscribed to our newsletter!")
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-black py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h2
            className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Subscribe to our Newsletters
          </h2>

          {/* Newsletter Form */}
          <form onSubmit={handleSubscribe} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200"
                style={{ fontFamily: '"Poppins", sans-serif' ,
                      borderRadius: "50px 50px 50px 0px",
                }}
              />
            </div>

            {/* Subscribe Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                  borderRadius: "50px 50px 50px 0px",
                
              }}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default FourthSection
