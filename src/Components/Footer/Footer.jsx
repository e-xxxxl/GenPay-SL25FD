import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {/* Genpay Column */}
          <div>
            <h3
              className="text-white text-lg font-semibold mb-4 sm:mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Genpay
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Career
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3
              className="text-white text-lg font-semibold mb-4 sm:mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h3
              className="text-white text-lg font-semibold mb-4 sm:mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Socials
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Snapchat
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          {/* Work with us Column */}
          <div>
            <h3
              className="text-white text-lg font-semibold mb-4 sm:mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Work with us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Become a partner
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Become an ambassador
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <p className="text-gray-500 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Copyrights 2024. All rights reserved - Genpay
            </p>

            {/* Legal Links */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200"
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