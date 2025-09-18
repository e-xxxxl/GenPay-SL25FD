import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Plus, Calendar, MapPin, Users, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThirdSection = ({ onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownEventId, setDropdownEventId] = useState(null); // Track which event's dropdown is open
  const dropdownRef = useRef(null); // Ref for clicking outside to close dropdown
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownEventId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("https://genpay-sl25bd-1.onrender.com/api/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== "success") {
          throw new Error(data.message || "Failed to fetch events");
        }

        setEvents(data.data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to fetch events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Check for event status
  useEffect(() => {
    const checkEventStatus = () => {
      const now = new Date();
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          const eventEndDate = new Date(event.endDate || event.date);
          const hasTickets = event.tickets && Array.isArray(event.tickets) && event.tickets.length > 0;

          let status;
          if (!hasTickets) {
            status = "notcompleted"; // Event setup incomplete if no tickets
          } else if (now > eventEndDate) {
            status = "completed"; // Event ended if current time is after end date
          } else {
            status = "upcoming"; // Event is upcoming if current time is before or on end date
          }

          return { ...event, status };
        })
      );
    };

    if (events.length > 0) {
      checkEventStatus();
      const interval = setInterval(checkEventStatus, 60000); // Update every minute
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [events.length]);

  const handleCreateEvent = () => {
    if (onCreateEvent) {
      onCreateEvent();
    } else {
      navigate("/create-event");
    }
  };

  const handleEventClick = (event) => {
    navigate(`/event-details/${event.id}`);
  };

  const handleEventMenu = (event, action) => {
    if (action === "menu") {
      setDropdownEventId(dropdownEventId === event.id ? null : event.id); // Toggle dropdown
    } else if (action === "delete") {
      if (window.confirm(`Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`)) {
        handleDeleteEvent(event.id);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to delete event");
    }

    // Remove the deleted event from the state
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    setDropdownEventId(null); // Close dropdown
    setError(null); // Clear any previous errors
  } catch (err) {
    console.error("Error deleting event:", err);
    setError(err.message || "Failed to delete event");
  }
};

  const categories = [
    "All",
    "Music",
    "Sports",
    "Business",
    "Technology",
    "Art & Culture",
    "Food & Drink",
    "Health & Wellness",
    "Education",
    "Entertainment",
    "Networking",
    "Other",
  ];
  const filteredEvents = events.filter(
    (event) => selectedCategory === "All" || event.category === selectedCategory
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              My Events
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Categories
              </span>
              <div className="bg-gray-800 rounded px-3 py-1">
                <span className="text-white text-sm">Loading...</span>
              </div>
            </div>
          </div>
          {error && (
  <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
    {error}
  </div>
)}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-gray-700 h-32 w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-700 h-3 rounded w-1/2"></div>
                  <div className="bg-gray-700 h-3 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              My Events
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-6">
              <p className="text-red-400 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                  fontFamily: '"Poppins", sans-serif',
                  borderRadius: "25px",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - No events found
  if (!loading && events.length === 0) {
    return (
      <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              My Events
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Categories
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-white text-xl font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No Events Found
                </h2>
                <p className="text-gray-400 text-base max-w-md" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You haven't created any events yet. Start by creating your first event to engage with your audience.
                </p>
              </div>
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                  fontFamily: '"Poppins", sans-serif',
                  borderRadius: "25px",
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Events grid - Main content
  return (
    <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
            My Events
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Categories
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-gray-900 rounded-2xl overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl ${
                  event.status === "completed"
                    ? "ring-2 ring-green-500 ring-opacity-50"
                    : event.status === "notcompleted"
                    ? "ring-2 ring-yellow-500 ring-opacity-50"
                    : ""
                }`}
                onClick={() => handleEventClick(event)}
              >
                {event.status === "completed" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 z-10 pointer-events-none"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
                          "linear-gradient(45deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)",
                          "linear-gradient(45deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="w-full h-full"
                    />
                  </motion.div>
                )}
                {event.status === "notcompleted" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 z-10 pointer-events-none"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(234, 179, 8, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)",
                          "linear-gradient(45deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)",
                          "linear-gradient(45deg, rgba(234, 179, 8, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="w-full h-full"
                    />
                  </motion.div>
                )}
                <div className="absolute top-3 left-3 z-20">
                  {event.status === "completed" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </motion.div>
                  )}
                  {event.status === "upcoming" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Upcoming
                    </motion.div>
                  )}
                  {event.status === "notcompleted" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Event Setup Incomplete
                    </motion.div>
                  )}
                </div>
                <div className="relative">
                  <img
                    src={event.image || event.poster || "/placeholder.svg?height=160&width=300"}
                    alt={event.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=160&width=300";
                    }}
                  />
                  <div className="absolute top-3 right-3 z-20" ref={dropdownRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventMenu(event, "menu");
                      }}
                      className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {dropdownEventId === event.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-30"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventMenu(event, "delete");
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Event
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="p-5 relative z-10">
                  <h3
                    className="text-white font-semibold text-lg mb-3 group-hover:text-gray-200 transition-colors line-clamp-2"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span style={{ fontFamily: '"Poppins", sans-serif' }} className="truncate">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {event.attendees || 0} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-center">
          <button
            onClick={handleCreateEvent}
            className="inline-flex items-center text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "25px",
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </button>
        </div>
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThirdSection;