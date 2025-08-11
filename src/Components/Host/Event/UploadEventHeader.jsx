"use client"

import { useState, useRef } from "react";
import { ArrowLeft, Upload, ImageIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const UploadEventHeader = ({ onNavigate, onImageUpload, onSkip, onContinue }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract eventId from URL query or props
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId") || (onNavigate && location.state?.eventId);

  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate(-1);
    } else {
      window.history.back();
    }
  };

  const handleFileSelect = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file", {
        position: "top-right",
        autoClose: 3000,
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
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB", {
        position: "top-right",
        autoClose: 3000,
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
      });
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    await uploadImageToBackend(file);
  };

  const uploadImageToBackend = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (!eventId) {
        throw new Error("Event ID is missing");
      }

      const formData = new FormData();
      formData.append("eventImage", file);
      formData.append("imageType", "header");
      formData.append("eventId", eventId); // Include eventId

      const response = await axios.post("http://localhost:5000/api/events/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      console.log("Image uploaded successfully:", response.data);
      setUploadedImageUrl(response.data.data.imageUrl);

      if (onImageUpload) {
        onImageUpload({
          file: file,
          url: response.data.data.imageUrl,
          uploadId: response.data.data.uploadId,
          eventId,
        });
      }

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
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
      });

      // Navigate to gallery upload with eventId
      setTimeout(() => {
        if (onNavigate) {
          onNavigate("/create-event/upload-event-gallery", { eventId });
        } else {
          navigate(`/create-event/upload-event-gallery?eventId=${eventId}`);
        }
      }, 2000);
    } catch (error) {
      console.error("Image upload failed:", error);
      let errorMessage = error.response?.data?.message || "Failed to upload image. Please try again.";
      toast.error(errorMessage, {
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
      });

      setSelectedImage(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      // Default skip behavior
      console.log("Skipping image upload")
    }
  }

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        file: selectedImage,
        url: uploadedImageUrl,
        hasImage: !!selectedImage,
      })
    } else {
      // Default continue behavior
      console.log("Continuing with image:", {
        fileName: selectedImage?.name || "No image",
        imageUrl: uploadedImageUrl,
      })
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Set your event image
          </h1>
        </div>

        {/* Recommendation Banner */}
        <div
          className="w-full px-4 py-3 mb-8 text-white text-sm text-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
            fontFamily: '"Poppins", sans-serif',
            borderRadius: "10px",
          }}
        >
          Images with 1275px x 1650px size is recommended
        </div>

        {/* Upload Area */}
        <div className="mb-12">
          <div
            className={`relative w-full h-80 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
              isDragging ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-gray-500"
            }`}
            style={{ borderRadius: "15px" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            {imagePreview ? (
              // Image Preview with Upload Progress
              <div className="relative w-full h-full">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Event preview"
                  className="w-full h-full object-cover rounded-lg"
                  style={{ borderRadius: "15px" }}
                />

                {/* Upload Progress Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-sm mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Uploading... {uploadProgress}%
                      </p>
                      <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-red-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Change Image Overlay */}
                {!isUploading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Click to change image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Upload Placeholder
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div
                  className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4"
                  style={{ borderRadius: "10px" }}
                >
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm text-center px-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {isDragging ? "Drop your image here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="flex-1 py-3 text-gray-400 hover:text-white font-medium transition-all duration-200 text-sm border border-gray-600 rounded-lg hover:border-gray-500 bg-gray-800"
            style={{ fontFamily: '"Poppins", sans-serif', borderRadius: "15px 15px 15px 0px" }}
          >
            Skip
          </button>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isUploading}
            className="flex-1 py-3 text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
          >
            {isUploading ? "Uploading..." : "Continue"}
          </button>
        </div>

        {/* Selected Image Info */}
        {selectedImage && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {selectedImage.name}
                </p>
                <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {uploadedImageUrl && !isUploading && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Uploaded
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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

export default UploadEventHeader
