"use client"

// import { useState } from "react"
// import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react"

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     userType: "individual",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     location: "",
//     password: "",
//     confirmPassword: "",
//   })

//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errors, setErrors] = useState({})

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid"
//     }
//     if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
//     if (!formData.location.trim()) newErrors.location = "Location is required"
//     if (!formData.password) {
//       newErrors.password = "Password is required"
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters"
//     }
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password"
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     setIsSubmitting(true)

//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         const result = await response.json()
//         console.log("Signup successful:", result)
//         // Handle successful signup (redirect, show success message, etc.)
//         alert("Account created successfully!")
//       } else {
//         const errorData = await response.json()
//         console.error("Signup failed:", errorData)
//         alert("Signup failed. Please try again.")
//       }
//     } catch (error) {
//       console.error("Network error:", error)
//       alert("Network error. Please check your connection and try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleGoBack = () => {
//     // Add navigation logic here
//     window.history.back()
//   }

//   const handleLoginRedirect = () => {
//     // Add navigation to login page
//     console.log("Redirect to login")
//   }

//   return (
//     <div className="min-h-screen bg-black md:px-72 px-6 py-8">
//       <div className="w-full max-w-sm">
//         {/* Header */}
//         <div className="flex items-center mb-6">
//           <div
//             className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
//             style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
//           >
//             <ArrowLeft className="w-4 h-4 text-black" onClick={handleGoBack} />
//           </div>
//           <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
//             Sign Up
//           </h1>
//         </div>

//         {/* Subtitle */}
//         <p className="text-white text-sm mb-6 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
//           Your gateway to creative events, merch and meaningful connections.
//         </p>

//         {/* User Type Toggle */}
//         <div className="flex mb-6 gap-3">
//           <button
//             type="button"
//             onClick={() => handleInputChange("userType", "individual")}
//             className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
//               formData.userType === "individual" ? "text-white" : "text-gray-400 hover:text-white"
//             }`}
//             style={{
//               background:
//                 formData.userType === "individual" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
//               fontFamily: '"Poppins", sans-serif',
//                borderRadius:'10px 10px 10px 0px ',
//             }}
//           >
//             Individual
//           </button>
//           <button
//             type="button"
//             onClick={() => handleInputChange("userType", "organization")}
//             className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
//               formData.userType === "organization" ? "text-white" : "text-gray-400 hover:text-white"
//             }`}
//             style={{
//               background:
//                 formData.userType === "organization" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
//               fontFamily: '"Poppins", sans-serif',
//                borderRadius:'10px 10px 10px 0px ',
//             }}
//           >
//             Organization
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* First Name */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="First Name"
//               value={formData.firstName}
//               onChange={(e) => handleInputChange("firstName", e.target.value)}
//               className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             <div
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
//               style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
//             >
//               <Plus className="w-3 h-3 text-white" />
//             </div>
//             {errors.firstName && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.firstName}
//               </p>
//             )}
//           </div>

//           {/* Last Name */}
//           <div>
//             <input
//               type="text"
//               placeholder="Last Name"
//               value={formData.lastName}
//               onChange={(e) => handleInputChange("lastName", e.target.value)}
//               className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             {errors.lastName && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.lastName}
//               </p>
//             )}
//           </div>

//           {/* Email Address */}
//           <div>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={(e) => handleInputChange("email", e.target.value)}
//               className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             {errors.email && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           {/* Phone Number */}
//           <div>
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={formData.phoneNumber}
//               onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
//               className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             {errors.phoneNumber && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.phoneNumber}
//               </p>
//             )}
//           </div>

//           {/* Location */}
//           <div>
//             <input
//               type="text"
//               placeholder="Location"
//               value={formData.location}
//               onChange={(e) => handleInputChange("location", e.target.value)}
//               className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             {errors.location && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.location}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={formData.password}
//               onChange={(e) => handleInputChange("password", e.target.value)}
//               className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//             >
//               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//             </button>
//             {errors.password && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//               className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//             >
//               {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//             </button>
//             {errors.confirmPassword && (
//               <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
//             style={{
//               background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
//               fontFamily: '"Poppins", sans-serif',
//                borderRadius:'10px 10px 10px 0px ',
//             }}
//           >
//             {isSubmitting ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         {/* Login Link */}
//         <div className="text-center mt-6">
//           <button
//             onClick={handleLoginRedirect}
//             className="text-gray-400 hover:text-white text-xs transition-colors"
//             style={{ fontFamily: '"Poppins", sans-serif' }}
//           >
//             Already have an Account? Click here
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signup


"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"

const nigerianStates = [
  "Lagos, Ikeja",
  "Abia, Umuahia",
  "Adamawa, Yola",
  "Akwa Ibom, Uyo",
  "Anambra, Awka",
  "Bauchi, Bauchi",
  "Bayelsa, Yenagoa",
  "Benue, Makurdi",
  "Borno, Maiduguri",
  "Cross River, Calabar",
  "Delta, Asaba",
  "Ebonyi, Abakaliki",
  "Edo, Benin City",
  "Ekiti, Ado Ekiti",
  "Enugu, Enugu",
  "FCT, Abuja",
  "Gombe, Gombe",
  "Imo, Owerri",
  "Jigawa, Dutse",
  "Kaduna, Kaduna",
  "Kano, Kano",
  "Katsina, Katsina",
  "Kebbi, Birnin Kebbi",
  "Kogi, Lokoja",
  "Kwara, Ilorin",
  "Nasarawa, Lafia",
  "Niger, Minna",
  "Ogun, Abeokuta",
  "Ondo, Akure",
  "Osun, Osogbo",
  "Oyo, Ibadan",
  "Plateau, Jos",
  "Rivers, Port Harcourt",
  "Sokoto, Sokoto",
  "Taraba, Jalingo",
  "Yobe, Damaturu",
  "Zamfara, Gusau",
]

const Signup = () => {
     const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "individual",
    firstName: "",
    lastName: "",
    fullName: "", // Added for organization
    email: "",
    phoneNumber: "",
    location: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleUserTypeChange = (userType) => {
    // Clear form data when switching user types
    setFormData({
      userType,
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = formData.userType === "individual" ? "First name is required" : "Brand name is required"
    }
    if (formData.userType === "individual" && !formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (formData.userType === "organization" && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = formData.userType === "individual" ? "Email is required" : "Brand email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        formData.userType === "individual" ? "Phone number is required" : "Brand number is required"
    }
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Replace with your actual API endpoint
      // http://localhost:5000/api/auth/signup
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      localStorage.setItem("token", response.data.token) // Store JWT
       navigate('/verify-email', { state: { email: formData.email } })
      console.log("Signup successful:", response.data)

      // Show success toast
      toast.success("Account created successfully! Welcome to GenPay.", {
        position: "top-right",
        autoClose: 4000,
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

      // Reset form on success
      setFormData({
        userType: "individual",
        firstName: "",
        lastName: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        location: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Signup failed:", error.response.data)

        toast.error(error.response.data.message || "Signup failed. Please check your information and try again.", {
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
      } else {
        // Other errors (e.g., network error)
        console.error("Error:", error.message)

        toast.error("Connection error. Please check your network and try again.", {
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    // Add navigation logic here
    window.history.back()
  }

  const handleLoginRedirect = () => {
    // Add navigation to login page
    console.log("Redirect to login")
  }

  return (
    <div className="min-h-screen bg-black md:px-72 px-6 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Sign Up
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm mb-6 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Your gateway to creative events, merch and meaningful connections.
        </p>

        {/* User Type Toggle */}
        <div className="flex mb-6 gap-3">
          <button
            type="button"
            onClick={() => handleUserTypeChange("individual")}
            className={`py-2 px-6 w-50 rounded-full text-sm font-medium transition-all duration-200 ${
              formData.userType === "individual" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            style={{
              background:
                formData.userType === "individual" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "10px 10px 10px 0px",
            }}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeChange("organization")}
            className={`py-2 px-6 w-50 rounded-full text-sm font-medium transition-all duration-200 ${
              formData.userType === "organization" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            style={{
              background:
                formData.userType === "organization" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : "#374151",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "10px 10px 10px 0px",
            }}
          >
            Organization
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name / Brand Name */}
          <div className="relative">
            <input
              type="text"
              placeholder={formData.userType === "individual" ? "First Name" : "Brand Name"}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <Plus className="w-3 h-3 text-white" />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name - Only show for Individual */}
          {formData.userType === "individual" && (
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          )}

          {/* Full Name - Only show for Organization */}
          {formData.userType === "organization" && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          {/* Email Address / Brand Email Address */}
          <div>
            <input
              type="email"
              placeholder={formData.userType === "individual" ? "Email Address" : "Brand Email Address"}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number / Brand Number */}
          <div>
            <input
              type="tel"
              placeholder={formData.userType === "individual" ? "Phone Number" : "Brand Number"}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white focus:outline-none focus:border-gray-400 transition-colors text-sm appearance-none"
              style={{
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
              }}
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">
                Select Location
              </option>
              {nigerianStates.map((state, index) => (
                <option key={index} value={state} className="bg-gray-800 text-white">
                  {state}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.location}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <button
            onClick={handleLoginRedirect}
            className="text-gray-400 hover:text-white text-xs transition-colors"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Already have an Account? Click here
          </button>
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


export default Signup
