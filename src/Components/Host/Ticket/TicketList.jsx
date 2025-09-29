{"use client"};

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, MoreVertical, Edit, Trash2, Copy, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const TicketList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [eventName, setEventName] = useState("Loading Event...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Tickets");
  const [showDropdown, setShowDropdown] = useState(null);

  // Fetch event details and tickets
  useEffect(() => {
    const fetchData = async () => {
      let cancelled = false;
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        // Fetch event details
        const eventResponse = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!eventResponse.ok) {
          const errorData = await eventResponse.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `HTTP error! status: ${eventResponse.status}`);
        }
        const eventData = await eventResponse.json();
        if (eventData.status !== "success") {
          throw new Error(eventData.message || "Failed to fetch event");
        }
        setEventName(eventData.data.event.eventName || "Unnamed Event");

        // Fetch tickets
        const ticketsResponse = await fetch(`http://localhost:5000/api/events/${id}/getTickets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ticketsResponse.ok) {
          const errorData = await ticketsResponse.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `HTTP error! status: ${ticketsResponse.status}`);
        }
        const data = await ticketsResponse.json();
        if (data.status !== "success") {
          throw new Error(data.message || "Failed to fetch tickets");
        }

        // Map backend ticket data to frontend format
        const mappedTickets = (data.data.tickets || []).map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          type: ticket.ticketType,
          price: ticket.ticketType === "Individual" ? ticket.perTicketPrice || 0 : ticket.groupPrice || 0,
          currency: ticket.ticketType === "Individual" ? ticket.perTicketCurrency || "USD" : ticket.groupPriceCurrency || "USD",
          tag: ticket.groupSize === "Unlimited Quantity" ? "Unlimited Quantity" : ticket.groupSize ? `${ticket.groupSize} Members` : `${ticket.quantity} Tickets`,
          status: ticket.groupSize === "Unlimited Quantity" || ticket.quantity > 0 ? "active" : "sold out",
          quantity: ticket.quantity,
          ticketDescription: ticket.ticketDescription || "",
          perks: ticket.perks || [],
          transferFees: ticket.transferFees || false,
          purchaseLimit: ticket.purchaseLimit || null,
        }));
        setTickets(mappedTickets);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setEventName("Demo Event");
        // Fallback mock data
        setTickets([
          {
            id: uuidv4(),
            name: "Regular",
            type: "Individual",
            price: 25000,
            currency: "NGN",
            tag: "Unlimited Quantity",
            status: "active",
            quantity: 100,
            ticketDescription: "General admission ticket",
            perks: ["Access to main event"],
            transferFees: false,
          },
          {
            id: uuidv4(),
            name: "VIP",
            type: "Group",
            price: 50000,
            currency: "NGN",
            tag: "5 Members",
            status: "active",
            quantity: 20,
            ticketDescription: "VIP group access",
            perks: ["VIP seating", "Complimentary drinks"],
            transferFees: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddTicket = () => {
    navigate(`/add-ticket/${id}`);
  };

  const handleEditTicket = (ticketId) => {
    navigate(`/edit-ticket/${id}/${ticketId}`);
    setShowDropdown(null);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`http://localhost:5000/api/events/${id}/tickets/${ticketId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      setShowDropdown(null);
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert("Failed to delete ticket: " + err.message);
    }
  };

  const handleDuplicateTicket = async (ticket) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const duplicatedTicket = {
        ...ticket,
        id: uuidv4(),
        name: `${ticket.name} (Copy)`,
      };
      const response = await fetch(`http://localhost:5000/api/events/${id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(duplicatedTicket),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets((prev) => [...prev, {
        id: data.data.ticket.id,
        name: data.data.ticket.name,
        type: data.data.ticket.ticketType,
        price: data.data.ticket.ticketType === "Individual" ? data.data.ticket.perTicketPrice || 0 : data.data.ticket.groupPrice || 0,
        currency: data.data.ticket.ticketType === "Individual" ? data.data.ticket.perTicketCurrency || "USD" : data.data.ticket.groupPriceCurrency || "USD",
        tag: data.data.ticket.groupSize === "Unlimited Quantity" ? "Unlimited Quantity" : data.data.ticket.groupSize ? `${data.data.ticket.groupSize} Members` : `${data.data.ticket.quantity} Tickets`,
        status: data.data.ticket.groupSize === "Unlimited Quantity" || data.data.ticket.quantity > 0 ? "active" : "sold out",
        quantity: data.data.ticket.quantity,
        ticketDescription: data.data.ticket.ticketDescription || "",
        perks: data.data.ticket.perks || [],
        transferFees: data.data.ticket.transferFees || false,
        purchaseLimit: data.data.ticket.purchaseLimit || null,
      }]);
      setShowDropdown(null);
    } catch (err) {
      console.error("Error duplicating ticket:", err);
      alert("Failed to duplicate ticket: " + err.message);
    }
  };

  const formatPrice = (price, currency = "USD") => {
    const symbols = { USD: "$", NGN: "₦", GBP: "£", EUR: "€" };
    return `${symbols[currency] || currency}${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 py-6 md:px-6 md:py-8">
        <div className="w-full max-w-md mx-auto text-white text-lg text-center" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Loading tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 md:px-6 md:py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <h1 className="text-white text-lg font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {eventName}
            </h1>
          </div>
          {/* Navigation Tabs */}
          <nav className="flex flex-wrap space-x-4 sm:space-x-6 border-b border-gray-700 pb-3">
            {["Event", "Tickets", "Sales", "More"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "Event") {
                    navigate(`/event-details/${id}`);
                  } else if (tab === "Sales") {
                    navigate(`/sales/${id}`);
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-white border-b-2"
                    : "text-gray-400 hover:text-gray-200 hover:border-b-2"
                }`}
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: activeTab === tab ? "#A228AF" : "transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
          {/* Add Ticket Button */}
          <div className="flex justify-start mt-6">
            <button
              onClick={handleAddTicket}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-90 shadow-md"
              style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Error loading tickets: {error}
            </p>
          </div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-lg mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
                No tickets found
              </p>
              <button
                onClick={handleAddTicket}
                className="text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 shadow-md"
                style={{
                  background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                  fontFamily: '"Poppins", sans-serif',
                  borderRadius: "15px 15px 15px 0px",
                }}
              >
                Add Ticket
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-900 rounded-lg p-4 relative md:p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {ticket.name}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {ticket.type}
                    </p>
                    <p className="text-white text-sm font-medium mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {ticket.price === 0 ? "Free" : formatPrice(ticket.price, ticket.currency)}
                    </p>
                    <p className="text-gray-300 text-xs mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {ticket.tag}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDropdown(showDropdown === ticket.id ? null : ticket.id)}
                    className="text-gray-400 hover:text-white transition-colors relative"
                  >
                    <MoreVertical className="w-5 h-5" />
                    {showDropdown === ticket.id && (
                      <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                        <button
                          onClick={() => handleEditTicket(ticket.id)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateTicket(ticket)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors flex items-center text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showDropdown && <div className="fixed inset-0 z-5" onClick={() => setShowDropdown(null)} />}
      </div>
    </div>
  );
};

export default TicketList;