"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useLocation } from 'react-router-dom';

import axios from "axios"


const EmailVerify = () => {
    const location = useLocation();
      const [email] = useState(location.state?.email || "")
  const [isResending, setIsResending] = useState(false)
 
  const handleGoBack = () => {
    // Add navigation logic here
    window.history.back()
  }
const maskEmail = (email) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain || name.length < 3) return `***@${domain}`;

  const first = name[0];
  const second = name[1] ;
  const last = name[name.length - 1];
  const masked = "*".repeat(name.length - 2);

  return `${first}${second}${masked}${last}@${domain}`;
};



  const handleCheckInbox = () => {
    // Open default email client or redirect to email provider
    window.open("mailto:", "_blank")
  }
const handleResendCode = async () => {
  setIsResending(true);

  try {
    console.log("Resending verification email for:", email);

    await axios.post(
  "http://localhost:5000/api/auth/resend-verification",
  { email },
  { headers: { "Content-Type": "application/json" } }
);
    

    toast.success("Verification email sent successfully!", {
      // same styling
    });
  } catch (error) {
    console.error("Failed to resend verification email:", error);

    toast.error("Failed to resend email. Please try again.", {
      // same styling
    });
  } finally {
    setIsResending(false);
  }
};

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 lg:px-72 py-6 sm:py-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 sm:mb-12">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Email Verification
          </h1>
        </div>

        {/* Content */}
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Message */}
          <div className="space-y-4">
            <p
              className="text-white text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              An email was sent to <span className="font-medium">{maskEmail(email)}</span>
. Check for your email confirmation link
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Check Inbox Button */}
            <button
              onClick={handleCheckInbox}
              className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              Check Inbox
            </button>

            {/* Resend Code Button */}
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full text-gray-400 hover:text-white py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </div>

          {/* Additional Help Text */}
          <div className="pt-4">
            <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Didn't receive the email? Check your spam folder or try resending the verification code.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1f2937",
          color: "#ffffff",
          border: "1px solid #374151",
          borderRadius: "8px",
          fontFamily: '"Poppins", sans-serif',
          fontSize: "14px",
          minHeight: "60px",
        }}
      />
    </div>
  )
}

export default EmailVerify
