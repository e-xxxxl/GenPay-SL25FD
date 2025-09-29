{"use client"}
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Plus, X, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

const AddTicket = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    ticketDescription: "",
    ticketType: "Individual", // Default to Individual
    isFree: false, // Default to Paid
    perTicketPrice: "",
    perTicketCurrency: "NGN",
    groupPrice: "",
    groupPriceCurrency: "NGN",
    groupSize: 2, // Default to 2 people for Group tickets
    quantity: "", // Total tickets available for sale
    perks: [],
    transferFees: false,
    purchaseLimit: "",
  })
  const [newPerk, setNewPerk] = useState("")
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleTicketTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      ticketType: type,
      // Reset price fields when switching types
      perTicketPrice: type === "Individual" && !prev.isFree ? prev.perTicketPrice : "",
      groupPrice: type === "Group" && !prev.isFree ? prev.groupPrice : "",
      groupSize: type === "Group" ? 2 : null, // Reset to default group size for Group
    }))
  }

  const handlePricingTypeChange = (isFree) => {
    setFormData((prev) => ({
      ...prev,
      isFree,
      perTicketPrice: isFree ? "0" : prev.perTicketPrice || "",
      groupPrice: isFree ? "0" : prev.groupPrice || "",
    }))
  }

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      setFormData((prev) => ({
        ...prev,
        perks: [...prev.perks, newPerk.trim()],
      }))
      setNewPerk("")
    }
  }

  const handleRemovePerk = (index) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Validate required fields
      if (!formData.name || !formData.quantity) {
        throw new Error("Ticket name and quantity are required")
      }
      if (!formData.isFree && formData.ticketType === "Individual" && !formData.perTicketPrice) {
        throw new Error("Per ticket price is required for paid individual tickets")
      }
      if (!formData.isFree && formData.ticketType === "Group" && !formData.groupPrice) {
        throw new Error("Group price is required for paid group tickets")
      }

      const ticketData = {
        id: uuidv4(),
        name: formData.name.trim(),
        ticketType: formData.ticketType,
        ticketDescription: formData.ticketDescription.trim() || null,
        perTicketPrice:
          formData.ticketType === "Individual" ? (formData.isFree ? 0 : Number(formData.perTicketPrice) || 0) : null,
        perTicketCurrency: formData.ticketType === "Individual" ? formData.perTicketCurrency : null,
        groupPrice: formData.ticketType === "Group" ? (formData.isFree ? 0 : Number(formData.groupPrice) || 0) : null,
        groupPriceCurrency: formData.ticketType === "Group" ? formData.groupPriceCurrency : null,
        groupSize: formData.ticketType === "Group" ? Number(formData.groupSize) : null,
        quantity: Number(formData.quantity) || 0, // Total tickets available for sale
        perks: formData.perks,
        transferFees: formData.transferFees,
        purchaseLimit: Number(formData.purchaseLimit) || null,
      }

      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      navigate(`/ticket-list/${id}`)
    } catch (err) {
      console.error("Error adding ticket:", err)
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 md:px-6 md:py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(`/ticket-list/${id}`)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <h1 className="text-white text-lg font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Event Tickets
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-11" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Let's set up your event ticket
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Error: {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
          {/* Ticket Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTicketTypeChange("Individual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                formData.ticketType === "Individual" ? "text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                background:
                  formData.ticketType === "Individual"
                    ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)"
                    : undefined,
              }}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => handleTicketTypeChange("Group")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                formData.ticketType === "Group" ? "text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                background:
                  formData.ticketType === "Group" ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : undefined,
              }}
            >
              Group
            </button>
          </div>

          {/* Ticket Name */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ticket Name"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
              required
            />
          </div>

          {/* Ticket Description */}
          <div>
            <textarea
              name="ticketDescription"
              value={formData.ticketDescription}
              onChange={handleInputChange}
              placeholder="Ticket Description"
              rows={4}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Free/Paid Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePricingTypeChange(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                formData.isFree ? "text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                background: formData.isFree ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : undefined,
              }}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => handlePricingTypeChange(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !formData.isFree ? "text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                background: !formData.isFree ? "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" : undefined,
              }}
            >
              Paid
            </button>
          </div>

          {/* Group-specific fields */}
          {formData.ticketType === "Group" && (
            <>
              {/* Group Size */}
              <div>
                <select
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 appearance-none"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((size) => (
                    <option key={size} value={size}>
                      {size} people
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity (Number of Group Tickets) */}
              <div>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Number of Group Tickets"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
                  min="0"
                  required
                />
              </div>

              {/* Group Price */}
              <div className="flex gap-2 flex-col sm:flex-row">
                <select
                  name="groupPriceCurrency"
                  value={formData.groupPriceCurrency}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 appearance-none"
                  disabled={formData.isFree}
                >
                  <option value="NGN">NGN (₦)</option>
                </select>
                <input
                  type="number"
                  name="groupPrice"
                  value={formData.groupPrice}
                  onChange={handleInputChange}
                  placeholder="Group Price"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
                  min="0"
                  disabled={formData.isFree}
                  required={!formData.isFree}
                />
              </div>
            </>
          )}

          {/* Individual-specific fields */}
          {formData.ticketType === "Individual" && (
            <>
              {/* Quantity (Number of Individual Tickets) */}
              <div>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Number of Tickets"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
                  min="0"
                  required
                />
              </div>

              {/* Per Ticket Price */}
              <div className="flex gap-2 flex-col sm:flex-row">
                <select
                  name="perTicketCurrency"
                  value={formData.perTicketCurrency}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 appearance-none"
                  disabled={formData.isFree}
                >
                  <option value="NGN">NGN (₦)</option>
                </select>
                <input
                  type="number"
                  name="perTicketPrice"
                  value={formData.perTicketPrice}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
                  min="0"
                  disabled={formData.isFree}
                  required={!formData.isFree}
                />
              </div>
            </>
          )}

          {/* Purchase Limit */}
          <div>
            <input
              type="number"
              name="purchaseLimit"
              value={formData.purchaseLimit}
              onChange={handleInputChange}
              placeholder="Purchase Limit"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
              min="0"
            />
          </div>

          {/* Transfer Fees */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="transferFees"
              checked={formData.transferFees}
              onChange={handleInputChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 bg-gray-800 border-gray-600 rounded"
            />
            <label className="text-white text-sm">Transfer fees to guest</label>
          </div>

          {/* Perks */}
          <div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                value={newPerk}
                onChange={(e) => setNewPerk(e.target.value)}
                placeholder="Perks"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:border-pink-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleAddPerk}
                className="px-4 py-3 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
              >
                <Plus className="w-4 h-4 inline" />
                <span className="ml-1 text-sm">Add perk</span>
              </button>
            </div>

            {/* Display added perks */}
            <div className="mt-2 space-y-1">
              {formData.perks.map((perk, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded-lg border border-gray-600"
                >
                  <span className="text-white text-sm">{perk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 flex-col sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/ticket-list/${id}`)}
              className="w-full py-3 text-white rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTicket