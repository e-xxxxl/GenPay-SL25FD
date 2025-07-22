"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Plus, ImageIcon, X, Upload } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const UploadEventGallery = ({ onNavigate, onGalleryUpload, onSkip, onContinue }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadedImageUrls, setUploadedImageUrls] = useState([])

  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate(-1)
    } else {
      window.history.back()
    }
  }

  const handleFileSelect = async (files) => {
    const validFiles = []

    // Validate each file
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`, {
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
        })
        continue
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`, {
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
        })
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // Create previews and add to selected images
    const newImages = []
    for (const file of validFiles) {
      const reader = new FileReader()
      const imageData = {
        id: Date.now() + Math.random(),
        file: file,
        preview: null,
        uploaded: false,
        uploading: false,
        url: null,
      }

      reader.onload = (e) => {
        imageData.preview = e.target?.result
        setSelectedImages((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((img) => img.id === imageData.id)
          if (index !== -1) {
            updated[index] = { ...updated[index], preview: e.target?.result }
          }
          return updated
        })
      }
      reader.readAsDataURL(file)

      newImages.push(imageData)
    }

    setSelectedImages((prev) => [...prev, ...newImages])

    // Upload to backend
    await uploadImagesToBackend(newImages)
  }

  const uploadImagesToBackend = async (images) => {
    setIsUploading(true)

    try {
      // Get the JWT token from storage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Upload each image
      for (const imageData of images) {
        // Update uploading state
        setSelectedImages((prev) => prev.map((img) => (img.id === imageData.id ? { ...img, uploading: true } : img)))

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("eventImage", imageData.file)
        formData.append("imageType", "gallery")

        try {
          const response = await axios.post("http://localhost:5000/api/events/upload-gallery", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress((prev) => ({
                ...prev,
                [imageData.id]: progress,
              }))
            },
          })

          console.log("Image uploaded successfully:", response.data)

          // Update image as uploaded
          setSelectedImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id
                ? {
                    ...img,
                    uploading: false,
                    uploaded: true,
                    url: response.data.data.imageUrl,
                    uploadId: response.data.data.uploadId,
                  }
                : img,
            ),
          )

          // Add to uploaded URLs
          setUploadedImageUrls((prev) => [...prev, response.data.data.imageUrl])
        } catch (error) {
          console.error("Image upload failed:", error)

          // Update image as failed
          setSelectedImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id ? { ...img, uploading: false, uploaded: false, error: true } : img,
            ),
          )

          let errorMessage = `Failed to upload ${imageData.file.name}`
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }

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
          })
        }
      }

      // Call parent callback with uploaded images
      if (onGalleryUpload) {
        const uploadedImages = selectedImages.filter((img) => img.uploaded)
        onGalleryUpload(uploadedImages)
      }

      if (images.some((img) => selectedImages.find((selected) => selected.id === img.id)?.uploaded)) {
        toast.success("Gallery images uploaded successfully!", {
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
        })
      }
    } catch (error) {
      console.error("Gallery upload failed:", error)

      let errorMessage = "Failed to upload gallery images. Please try again."
      if (error.message === "No authentication token found") {
        errorMessage = "Please log in to upload images."
      }

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
      })
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files)
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

    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleAddImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId))
    setUploadedImageUrls((prev) => {
      const imageToRemove = selectedImages.find((img) => img.id === imageId)
      return prev.filter((url) => url !== imageToRemove?.url)
    })
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      console.log("Skipping gallery upload")
    }
  }

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        images: selectedImages,
        uploadedUrls: uploadedImageUrls,
        hasImages: selectedImages.length > 0,
      })
    } else {
      console.log("Continuing with gallery:", {
        imageCount: selectedImages.length,
        uploadedCount: selectedImages.filter((img) => img.uploaded).length,
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
            Set your event gallery
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
          Images with 1080px x 1080px size is recommended
        </div>

        {/* Upload Area */}
        <div className="mb-12">
          {/* Add Image Button */}
          <div
            className={`w-24 h-24 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center mb-6 ${
              isDragging ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-gray-500"
            }`}
            style={{ borderRadius: "15px" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleAddImageClick}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ borderRadius: "8px" }}
              >
                <ImageIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex items-center justify-center">
                <Plus className="w-4 h-4 text-white mr-1" />
                <span className="text-white text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Add Image
                </span>
              </div>
            </div>
          </div>

          {/* Selected Images Grid */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedImages.map((image) => (
                <div key={image.id} className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                    {image.preview && (
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt="Gallery preview"
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Upload Progress Overlay */}
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            {uploadProgress[image.id] || 0}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Success/Error Indicators */}
                    {image.uploaded && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}

                    {image.error && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    )}

                    {/* Remove Button */}
                    {!image.uploading && (
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 left-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drop Zone for Multiple Files */}
          {selectedImages.length === 0 && (
            <div
              className={`w-full h-40 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isDragging ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-gray-500"
              }`}
              style={{ borderRadius: "15px" }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleAddImageClick}
            >
              <div className="text-center text-gray-400">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {isDragging ? "Drop your images here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  PNG, JPG, JPEG up to 10MB each
                </p>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
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

        {/* Gallery Info */}
        {selectedImages.length > 0 && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span className="text-white text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  {selectedImages.filter((img) => img.uploaded).length} uploaded
                </span>
              </div>
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

export default UploadEventGallery
