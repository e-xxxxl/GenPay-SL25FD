// components/ThirdSection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this if using React Router
import { MoreVertical, Plus, Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThirdSection = ({ onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate(); // Add this for navigation

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

        const response = await fetch("http://localhost:5000/api/events", {
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
          const eventStartDate = new Date(event.date);

          let status = "upcoming"; // Default status
          const hasTicketPolicy =
            event.ticketPolicy &&
            (event.ticketPolicy.refundPolicy ||
             event.ticketPolicy.transferPolicy ||
             event.ticketPolicy.otherRules);

          if (now > eventEndDate && hasTicketPolicy) {
            status = "completed";
          } else if (!hasTicketPolicy && now <= eventEndDate) {
            status = "notcompleted";
          } else if (hasTicketPolicy && now >= eventStartDate && now <= eventEndDate) {
            status = "ongoing";
          }

          return { ...event, status };
        })
      );
    };

    if (events.length > 0) {
      checkEventStatus();
      const interval = setInterval(checkEventStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  const handleCreateEvent = () => {
    if (onCreateEvent) {
      onCreateEvent();
    } else {
      window.location.href = "/create-event";
    }
  };

  const handleEventClick = (event) => {
    navigate(`/event-details/${event.id}`); // Navigate to EventDetails with event ID
  };

  const handleEventMenu = (event, action) => {
    console.log(`${action} event:`, event.title);
    // Handle edit, delete, duplicate, etc.
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
                  event.status === "completed" ? "ring-2 ring-green-500 ring-opacity-50" : ""
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
                  {event.status === "ongoing" && (
                    <div className="flex items-center bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      Live
                    </div>
                  )}
                  {event.status === "notcompleted" && (
                    <div className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      Event Setup Incomplete
                    </div>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventMenu(event, "menu");
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors z-20 backdrop-blur-sm"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
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
              window.location.href = "/login";
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