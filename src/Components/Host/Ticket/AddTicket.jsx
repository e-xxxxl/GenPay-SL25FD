"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AddTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ticketDescription: "",
    ticketType: "Individual",
    perTicketPrice: "",
    perTicketCurrency: "USD",
    groupPrice: "",
    groupPriceCurrency: "USD",
    groupSize: "Unlimited Quantity",
    quantity: "",
    perks: [],
    transferFees: false,
    purchaseLimit: "",
  });
  const [newPerk, setNewPerk] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      setFormData((prev) => ({
        ...prev,
        perks: [...prev.perks, newPerk.trim()],
      }));
      setNewPerk("");
    }
  };

  const handleRemovePerk = (index) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const ticketData = {
        id: uuidv4(),
        name: formData.name.trim(),
        ticketType: formData.ticketType,
        ticketDescription: formData.ticketDescription.trim() || null,
        perTicketPrice: formData.ticketType === "Individual" ? Number(formData.perTicketPrice) || 0 : null,
        perTicketCurrency: formData.ticketType === "Individual" ? formData.perTicketCurrency : null,
        groupPrice: formData.ticketType === "Group" ? Number(formData.groupPrice) || 0 : null,
        groupPriceCurrency: formData.ticketType === "Group" ? formData.groupPriceCurrency : null,
        groupSize: formData.groupSize,
        quantity: Number(formData.quantity) || 0,
        perks: formData.perks,
        transferFees: formData.transferFees,
        purchaseLimit: formData.groupSize === "Unlimited Quantity" ? null : Number(formData.purchaseLimit) || null,
      };

      const response = await fetch(`http://localhost:5000/api/events/${id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      navigate(`/ticket-list/${id}`);
    } catch (err) {
      console.error("Error adding ticket:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="mb-8 p-4 rounded-lg shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            borderBottom: "2px solid #A228AF",
          }}
        >
          <h1
            className="text-white text-2xl font-semibold tracking-wide"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Add Ticket
          </h1>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 shadow-md">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Error: {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 shadow-lg"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ticket Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ticket Description
                <textarea
                  name="ticketDescription"
                  value={formData.ticketDescription}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </label>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ticket Type
                <select
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Quantity
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                  required
                />
              </label>
            </div>
            {formData.ticketType === "Individual" && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Per Ticket Price
                    <input
                      type="number"
                      name="perTicketPrice"
                      value={formData.perTicketPrice}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Currency
                    <select
                      name="perTicketCurrency"
                      value={formData.perTicketCurrency}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </label>
                </div>
              </>
            )}
            {formData.ticketType === "Group" && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Group Price
                    <input
                      type="number"
                      name="groupPrice"
                      value={formData.groupPrice}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Group Currency
                    <select
                      name="groupPriceCurrency"
                      value={formData.groupPriceCurrency}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Group Size
                    <select
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="Unlimited Quantity">Unlimited Quantity</option>
                      <option value="Limited Quantity">Limited Quantity</option>
                    </select>
                  </label>
                </div>
                {formData.groupSize === "Limited Quantity" && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Number of Members
                      <input
                        type="number"
                        name="groupSize"
                        value={formData.groupSize === "Unlimited Quantity" ? "" : formData.groupSize}
                        onChange={(e) => setFormData((prev) => ({ ...prev, groupSize: e.target.value }))}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        min="2"
                        required
                      />
                    </label>
                  </div>
                )}
              </>
            )}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Purchase Limit
                <input
                  type="number"
                  name="purchaseLimit"
                  value={formData.purchaseLimit}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                />
              </label>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Perks
                <div className="flex items-center mt-1">
                  <input
                    type="text"
                    value={newPerk}
                    onChange={(e) => setNewPerk(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Add a perk"
                  />
                  <button
                    type="button"
                    onClick={handleAddPerk}
                    className="ml-2 bg-purple-600 text-white rounded-lg px-3 py-2 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  {formData.perks.map((perk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800 p-2 rounded-lg mb-1"
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
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="transferFees"
                checked={formData.transferFees}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 bg-gray-800 rounded"
              />
              <label className="ml-2 text-white text-sm font-medium">
                Transfer fees to guest
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/ticket-list/${id}`)}
              className="px-6 py-2 text-white rounded-lg hover:bg-gray-700"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90 shadow-md"
              style={{
                background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "15px 15px 15px 0px",
              }}
            >
              Add Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;