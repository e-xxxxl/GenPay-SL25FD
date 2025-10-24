const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Genpay Column */}
          <div className="space-y-4">
            <h3
              className="text-white text-base sm:text-lg font-semibold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Genpay
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about-us"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Career
                </a>
              </li>
              <li>
                <a
                  href="/explore"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h3
              className="text-white text-base sm:text-lg font-semibold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@genpay.ng"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-4">
            <h3
              className="text-white text-base sm:text-lg font-semibold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Socials
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/genpay.ng?igsh=MWJtcG12OHYwYmRmag=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/genpayng?t=YANEt6Wsz2T7q6jiYaX92g&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@genpay.ng?_t=ZM-903puvggodY&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          {/* Work with us Column */}
          <div className="space-y-4">
            <h3
              className="text-white text-base sm:text-lg font-semibold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Work with us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfjKkIwo8bBbIhRJLOJvD1YSTpvhy5LTGu_mFdy1nskE4IEEA/viewform"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Become a partner
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Become an ambassador
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Copyrights 2024. All rights reserved - Genpay
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6 items-center">
              <a
                href="/legal-documentation"
                className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Terms & Conditions
              </a>
              <a
                href="/legal-documentation"
                className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Privacy Policy
              </a>
              <a
                href="/refund-policy"
                className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
