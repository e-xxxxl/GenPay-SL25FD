// // Verified.js
// import { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Verified = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         console.log("Verifying token:", token); // Debug log
        
//         const response = await axios.get(
//           `https://genpay-sl25bd-1.onrender.com/api/auth/verify-email/${token}`
//         );

        
        
//         console.log("Verification response:", response.data); // Debug log
        
//         if (response.data.status === 'success') {
//           localStorage.setItem('token', response.data.token);
//           localStorage.setItem('isVerified', true);
//           navigate('/dashboard');
//         } else {
//           throw new Error(response.data.message || 'Verification failed');
//         }
//       } catch (error) {
//         console.error("Verification error:", error.response?.data || error.message);
//         navigate('/verify-email', { 
//             state: { error: error.response?.data?.message || 'Verification failed' }
//         });
//       }
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   return (
//     <div className="verification-container">
//       <div className="loader"></div>
//       <p>Verifying your email...</p>
//     </div>
//   );
// };

// export default Verified;



"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Check } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const Verified = ({ onContinue }) => {
      const { token } = useParams();
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("No verification token provided")
        setIsVerifying(false)
        return
      }

      try {
        // console.log("Verifying token:", token) // Debug log

        const response = await axios.get(`https://genpay-sl25bd-1.onrender.com/api/auth/verify-email/${token}`)

        // console.log("Verification response:", response.data) // Debug log

        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("isVerified", "true")
          setIsVerified(true)
          setIsVerifying(false)

          // Show success toast
          toast.success("Email verified successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            style: {
              background: "#1f2937",
              color: "#ffffff",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
            },
          })
        } else {
          throw new Error(response.data.message || "Verification failed")
        }
      } catch (error) {
        console.error("Verification error:", error.response?.data || error.message)
        setError(error.response?.data?.message || "Verification failed")
        setIsVerifying(false)

        toast.error(error.response?.data?.message || "Email verification failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "14px",
          },
        })
      }
    }

    verifyEmail()
  }, [token])

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      // Default navigation logic - redirect to dashboard
      window.location.href = "/login"
    }
  }

  const handleRetryVerification = () => {
    // Navigate back to email verification page
    window.location.href = "/verify-email"
  }

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          {/* Loading Spinner */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-transparent animate-spin mx-auto"
              style={{
                borderTopColor: "#A228AF",
              }}
            />
          </div>

          {/* Loading Text */}
          <p className="text-white text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Verifying your email...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !isVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          {/* Error Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
          >
            <span className="text-white text-2xl">✕</span>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Verification Failed
            </h2>
            <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {error}
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={handleRetryVerification}
            className="text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Success Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
        >
          <Check className="w-8 h-8 text-white" />
        </div>

        {/* Success Content */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Email Verified
          </h2>
          <p className="text-white text-sm leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Your email has been verified and your host dashboard is ready. Just a few more things to do though.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
            fontFamily: '"Poppins", sans-serif',
            borderRadius: "15px 15px 15px 0px",
          }}
        >
          Continue
        </button>
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

export default Verified
