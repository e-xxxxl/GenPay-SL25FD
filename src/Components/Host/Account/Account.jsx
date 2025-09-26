// components/Account.js
"use client"

import { useState, useEffect, useRef } from "react"
import { Edit, CreditCard, User, Mail, Phone, MapPin, Building, X, Trash2 } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Account = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payoutInfo, setPayoutInfo] = useState(null)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [payoutForm, setPayoutForm] = useState({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: ''
  })
  const [formError, setFormError] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [banks, setBanks] = useState([])
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const firstInputRef = useRef(null)
  const confirmModalRef = useRef(null)
  const deleteModalRef = useRef(null)

  // Base URL for API (use environment variable in production)
  const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com";

  // Email masking function
  const maskEmail = (email) => {
    if (!email) return ""
    const [name, domain] = email.split("@")
    if (!domain || name.length < 3) return `***@${domain}`
    const first = name[0]
    const second = name[1]
    const last = name[name.length - 1]
    const masked = "*".repeat(name.length - 2)
    return `${first}${second}${masked}${last}@${domain}`
  }

  // Fetch user data, payout info, and banks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch user profile
        const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(userResponse.data.data.user)

        // Fetch payout info
        try {
          const payoutResponse = await axios.get(`${API_BASE_URL}/api/payouts/payout-info`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setPayoutInfo(payoutResponse.data.data)
        } catch (payoutError) {
          console.log("No payout info found:", payoutError.response?.data?.message)
        }

        // Fetch banks
        const banksResponse = await axios.get(`${API_BASE_URL}/api/payouts/banks`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (banksResponse.data.status !== 'success') {
          throw new Error('Failed to fetch banks')
        }
        setBanks(banksResponse.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Focus trap for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirmModal) setShowDeleteConfirmModal(false)
        else if (showConfirmModal) setShowConfirmModal(false)
        else if (showPayoutModal) handleCloseModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showPayoutModal, showConfirmModal, showDeleteConfirmModal])

  // Resolve bank account name
  useEffect(() => {
    let timeoutId
    const fetchAccountName = async () => {
      if (payoutForm.bankCode && payoutForm.accountNumber.length === 10) {
        setFormLoading(true)
        try {
          const token = localStorage.getItem("token")
          const response = await axios.post(
            `${API_BASE_URL}/api/payouts/resolve-bank`,
            {
              bankCode: payoutForm.bankCode,
              accountNumber: payoutForm.accountNumber
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Failed to resolve account name')
          }
          setPayoutForm((prev) => ({
            ...prev,
            accountName: response.data.data.accountName
          }))
          setFormError(null)
        } catch (err) {
          setFormError(err.response?.data?.message || "Failed to resolve account name")
          setPayoutForm((prev) => ({ ...prev, accountName: '' }))
        } finally {
          setFormLoading(false)
        }
      }
    }

    if (payoutForm.bankCode && payoutForm.accountNumber.length === 10) {
      timeoutId = setTimeout(fetchAccountName, 500)
    }

    return () => clearTimeout(timeoutId)
  }, [payoutForm.bankCode, payoutForm.accountNumber])

  const handleEditPersonalInfo = () => {
    navigate("/account/edit")
  }

  const handleAddPayoutInfo = () => {
    setShowPayoutModal(true)
    if (payoutInfo) {
      setPayoutForm({
        bankName: payoutInfo.bankName || '',
        bankCode: payoutInfo.bankCode || '',
        accountNumber: payoutInfo.accountNumber || '',
        accountName: payoutInfo.accountName || ''
      })
    }
  }

  const handleDeletePayoutInfo = async () => {
    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${API_BASE_URL}/api/payouts/payout-info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPayoutInfo(null)
      setShowDeleteConfirmModal(false)
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete payout information")
    } finally {
      setFormLoading(false)
    }
  }

  const handlePayoutFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'bankName') {
      const selectedBank = banks.find((bank) => bank.name === value)
      setPayoutForm((prev) => ({
        ...prev,
        bankName: value,
        bankCode: selectedBank ? selectedBank.code : '',
        accountName: ''
      }))
    } else {
      setPayoutForm((prev) => ({
        ...prev,
        [name]: name === 'accountNumber' ? value.replace(/\D/g, '') : value
      }))
    }
    setFormError(null)
  }

  const handlePayoutFormSubmit = async (e) => {
    e.preventDefault()
    if (!payoutForm.bankName || !payoutForm.bankCode || !payoutForm.accountNumber || !payoutForm.accountName) {
      setFormError("All fields are required")
      return
    }
    if (!/^\d{10}$/.test(payoutForm.accountNumber)) {
      setFormError("Account number must be 10 digits")
      return
    }
    setShowPayoutModal(false)
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${API_BASE_URL}/api/payouts/payout-info`,
        {
          bankName: payoutForm.bankName,
          bankCode: payoutForm.bankCode,
          accountNumber: payoutForm.accountNumber,
          accountName: payoutForm.accountName
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setPayoutInfo(response.data.data.payoutInfo)
      setShowConfirmModal(false)
      setPayoutForm({ bankName: '', bankCode: '', accountNumber: '', accountName: '' })
      setFormError(null)
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save payout information")
      setShowConfirmModal(false)
      setShowPayoutModal(true) // Reopen form to show error
    } finally {
      setFormLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowPayoutModal(false)
    setPayoutForm({ bankName: '', bankCode: '', accountNumber: '', accountName: '' })
    setFormError(null)
  }

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false)
    setShowPayoutModal(true) // Reopen form if user cancels confirmation
  }

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false)
  }

  const getLoadingAnimation = () => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#A228AF", animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#A228AF", animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#A228AF", animationDelay: "300ms" }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center py-12">{getLoadingAnimation()}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div
              className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3"
              style={{ borderRadius: "10px" }}
            >
              <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Personal Information
            </h2>
            <div className="space-y-4">
              {user?.userType === "individual" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      First Name: <span className="text-white">{user?.firstName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {user?.userType === "organization" && (
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Organization Name: <span className="text-white">{user?.organizationName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {user?.userType === "individual" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Last Name: <span className="text-white">{user?.lastName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              {user?.userType === "organization" && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Full Name: <span className="text-white">{user?.fullName || "Not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Email Address: <span className="text-white">{maskEmail(user?.email) || "Not provided"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Phone Number: <span className="text-white">{user?.phoneNumber || "Not provided"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Location: <span className="text-white">{user?.location || "Not provided"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Account Type: <span className="text-white capitalize">{user?.userType || "Not specified"}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditPersonalInfo}
              className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px"
              }}
              aria-label="Edit personal information"
            >
              <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
              Edit Personal Info
            </button>
          </div>
          {/* Payout Information Section */}
          <div className="space-y-6">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Payout Information
            </h2>
            {payoutInfo ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Bank Name: <span className="text-white">{payoutInfo.bankName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Account Number: <span className="text-white">{payoutInfo.accountNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Account Name: <span className="text-white">{payoutInfo.accountName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddPayoutInfo}
                    className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
                    style={{
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px"
                    }}
                    aria-label="Edit payout information"
                  >
                    <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
                    Edit Payout Info
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
                    style={{
                      background: "linear-gradient(135deg, #FF0000 0%, #A228AF 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px"
                    }}
                    aria-label="Delete payout information"
                  >
                    <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                    Delete Payout Info
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No payout information added yet.
                </p>
                <button
                  onClick={handleAddPayoutInfo}
                  className="inline-flex items-center text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                    fontFamily: '"Poppins", sans-serif',
                    borderRadius: "15px 15px 15px 0px"
                  }}
                  aria-label="Add payout information"
                >
                  <CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />
                  Add Payout Info
                </button>
              </div>
            )}
          </div>
          {/* Payout Modal */}
          {showPayoutModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="payout-modal-title"
              aria-modal="true"
            >
              <div
                ref={modalRef}
                className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-md"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 id="payout-modal-title" className="text-white text-lg font-semibold">
                    {payoutInfo ? 'Edit Payout Information' : 'Add Payout Information'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white transition"
                    aria-label="Close payout modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handlePayoutFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="bankName" className="text-gray-400 text-sm">
                      Bank Name
                    </label>
                    <select
                      id="bankName"
                      name="bankName"
                      value={payoutForm.bankName}
                      onChange={handlePayoutFormChange}
                      className="w-full bg-black text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                      disabled={formLoading || banks.length === 0}
                      ref={firstInputRef}
                      aria-required="true"
                      aria-describedby={banks.length === 0 ? "bank-error" : undefined}
                    >
                      <option value="">Select a bank</option>
                      {banks.map((bank) => (
                        <option key={bank.code} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    {banks.length === 0 && (
                      <p id="bank-error" className="text-red-400 text-sm mt-1">
                        Unable to load bank list. Please try again later.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="text-gray-400 text-sm">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      name="accountNumber"
                      value={payoutForm.accountNumber}
                      onChange={handlePayoutFormChange}
                      maxLength={10}
                      className="w-full bg-white/5 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                      placeholder="Enter 10-digit account number"
                      disabled={formLoading}
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="accountName" className="text-gray-400 text-sm">
                      Account Name
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      name="accountName"
                      value={payoutForm.accountName}
                      readOnly
                      className="w-full bg-white/5 text-gray-400 border border-gray-600 rounded-lg px-3 py-2 mt-1"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                      placeholder={formLoading ? "Fetching account name..." : "Account name will appear here"}
                      aria-readonly="true"
                    />
                  </div>
                  {formError && (
                    <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {formError}
                    </p>
                  )}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-400 hover:text-white transition"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                      disabled={formLoading}
                      aria-label="Cancel payout form"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading || !payoutForm.accountName || banks.length === 0}
                      className="px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                      style={{
                        background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                        fontFamily: '"Poppins", sans-serif',
                        borderRadius: "15px 15px 15px 0px"
                      }}
                      aria-label="Proceed to confirm payout information"
                    >
                      {formLoading ? "Processing..." : "Proceed"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="confirm-modal-title"
              aria-modal="true"
            >
              <div
                ref={confirmModalRef}
                className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-md"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <h3 id="confirm-modal-title" className="text-white text-lg font-semibold mb-4">
                  Confirm Payout Information
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Please review the payout details below:
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400 text-sm">
                    Bank Name: <span className="text-white">{payoutForm.bankName}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Account Number: <span className="text-white">{payoutForm.accountNumber}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Account Name: <span className="text-white">{payoutForm.accountName}</span>
                  </p>
                </div>
                {formError && (
                  <p className="text-red-400 text-sm mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {formError}
                  </p>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseConfirmModal}
                    className="px-4 py-2 text-gray-400 hover:text-white transition"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                    disabled={formLoading}
                    aria-label="Cancel confirmation"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSave}
                    disabled={formLoading}
                    className="px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px"
                    }}
                    aria-label="Confirm and save payout information"
                  >
                    {formLoading ? "Saving..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Confirmation Modal */}
          {showDeleteConfirmModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="delete-confirm-modal-title"
              aria-modal="true"
            >
              <div
                ref={deleteModalRef}
                className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-md"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <h3 id="delete-confirm-modal-title" className="text-white text-lg font-semibold mb-4">
                  Delete Payout Information
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Are you sure you want to delete your payout information? This action cannot be undone.
                </p>
                {formError && (
                  <p className="text-red-400 text-sm mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {formError}
                  </p>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseDeleteConfirmModal}
                    className="px-4 py-2 text-gray-400 hover:text-white transition"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                    disabled={formLoading}
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePayoutInfo}
                    disabled={formLoading}
                    className="px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #FF0000 0%, #A228AF 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px"
                    }}
                    aria-label="Confirm delete payout information"
                  >
                    {formLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Account Status */}
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Account Status
            </h2>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${user?.isVerified ? "bg-green-500" : "bg-yellow-500"}`} aria-hidden="true" />
              <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Email Status: <span className={`${user?.isVerified ? "text-green-400" : "text-yellow-400"}`}>
                  {user?.isVerified ? "Verified" : "Pending Verification"}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
              <p className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Account Status: <span className="text-green-400">Active</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account