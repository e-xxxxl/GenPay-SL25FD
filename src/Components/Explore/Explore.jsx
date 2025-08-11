import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showAllPerCategory, setShowAllPerCategory] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null); // NEW: expand a single category
  const [filters, setFilters] = useState({
    category: 'All',
    dateRange: 'All',
  });

  const navigate = useNavigate();

  const fetchEvents = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching events from: https://genpay-sl25bd-1.onrender.com/api/events/public?page=${pageNum}`);

      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/public?page=${pageNum}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Response status:', response.status, 'Response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.status !== 'success' || !data.data || !Array.isArray(data.data.events)) {
        throw new Error('Invalid response format or no events found: ', data);
      }

      const formattedEvents = data.data.events.map((event) => ({
        _id: event._id.toString(),
        title: event.eventName || 'Unnamed Event',
        description: event.eventDescription || 'No description',
        date: event.startDateTime
          ? new Date(event.startDateTime).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'No Date',
        // Keep precise start time for accurate upcoming filtering
        startISO: event.startDateTime || null,
        location: (event.eventLocation && event.eventLocation.venue) || 'Unknown Location',
        // Flyer-ready portrait aspect (4:5)
        image: event.headerImage || 'https://via.placeholder.com/1080x1350?text=Event+Flyer',
        category: event.eventCategory,
         images: event.images || [], // Add images
      socialLinks: event.socialLinks || {}, // Add socialLinks
      tickets: event.tickets || [], // Add tickets
      }));

      console.log('Formatted events:', formattedEvents);

      setEvents((prevEvents) => (pageNum === 1 ? formattedEvents : [...prevEvents, ...formattedEvents]));
      setHasMore(formattedEvents.length > 0 && data.data.totalPages > pageNum);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    fetchEvents(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
    fetchEvents(1);
  };

  const handleViewMore = () => {
    // Global: show all items for every category and keep paginating if backend has more
    setShowAllPerCategory(true);
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchEvents(page + 1);
    }
  };

  // NEW: per-category "More" click
  const handleMoreForCategory = (cat) => {
    setExpandedCategory(cat); // expand only this category
    // Optionally pull more pages so we can show "all" available
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchEvents(page + 1);
    }
  };

  const handleCollapseCategory = () => setExpandedCategory(null);

  const handleEventClick = (event) => {
    const sanitizedTitle = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    navigate(`/explore/${sanitizedTitle}`, { state: { event } });
  };

  // Date helpers for dropdown filters
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  const isThisWeek = (date) => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59);
    return date >= startOfWeek && date <= endOfWeek;
  };
  const isThisMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const categoriesList = [
    'All',
    'Music',
    'Sports',
    'Business',
    'Technology',
    'Art & Culture',
    'Food & Drink',
    'Health & Wellness',
    'Education',
    'Entertainment',
    'Networking',
    'Other',
  ];

  const normalized = (c) => (c && String(c).trim()) || 'Other';

  // 1) Only current or future events
  const now = new Date();
  const upcomingOnly = events.filter((ev) => {
    if (ev.startISO) {
      const start = new Date(ev.startISO);
      return start >= now;
    }
    // Fallback: interpret date-only as the end of that day
    const d = new Date(ev.date);
    if (isNaN(d.getTime())) return true; // if unparseable, don't hide
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    return endOfDay >= now;
  });

  // 2) Apply search/category/date-range filters
  const baseFiltered = upcomingOnly.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'All' || normalized(event.category) === filters.category;

    const matchesDate =
      filters.dateRange === 'All' ||
      (filters.dateRange === 'Today' && isToday(new Date(event.date))) ||
      (filters.dateRange === 'ThisWeek' && isThisWeek(new Date(event.date))) ||
      (filters.dateRange === 'ThisMonth' && isThisMonth(new Date(event.date)));

    return matchesSearch && matchesCategory && matchesDate;
  });

  // "We think you'll love these" (display 3)
  const loveThese = baseFiltered.slice(0, 4);

  // Group by category
  const categoriesToRender = categoriesList.filter((c) => c !== 'All');
  const grouped = categoriesToRender.reduce((acc, cat) => {
    acc[cat] = baseFiltered.filter((ev) => normalized(ev.category) === cat);
    return acc;
  }, {});
  // Any categories not in the list go under "Other"
  const known = new Set(categoriesToRender);
  const extras = baseFiltered.filter((ev) => !known.has(normalized(ev.category)));
  if (extras.length) {
    grouped['Other'] = [...(grouped['Other'] || []), ...extras];
  }

  // Reusable flyer-styled card
  const EventCard = ({ event }) => (
    <div
      className="relative group rounded-[20px] overflow-hidden bg-neutral-900 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 cursor-pointer"
      onClick={() => handleEventClick(event)}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={event.image || '/placeholder.svg'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/90" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h4
          className="text-white text-base sm:text-lg font-semibold line-clamp-2"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          {event.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-pink-600/20 text-pink-300">
            {event.date}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-emerald-500/20 text-emerald-300">
            {event.location}
          </span>
          {event.category ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-purple-500/20 text-purple-300">
              {normalized(event.category)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  const shouldShowViewMore = (!showAllPerCategory || hasMore) && baseFiltered.length > 0;

  return (
    <section className="bg-black py-10 sm:py-14 md:py-18 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2
          className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Discover and secure tickets to the hottest
          <br className="hidden sm:block" /> events, all in one place
        </h2>

        {/* Search Bar */}
        <div className="max-w-3xl mt-6">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <span role="img" aria-label="search">🔍</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full h-12 sm:h-14 rounded-full bg-white text-black pl-12 pr-4 text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            />
          </div>
        </div>

        {/* We think you'll love these */}
        <div className="mt-10 sm:mt-12 flex items-center justify-between">
          <h3
            className="text-white text-lg sm:text-xl font-semibold"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            We think you'll love these
          </h3>
          <div
            className="text-xs sm:text-sm text-gray-400 select-none"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            More <span className="align-middle">↗</span>
          </div>
        </div>

        {loading && !error && <div className="text-white text-center py-10">Loading events...</div>}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mt-6 shadow-md">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Error: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Love these grid (max 3) */}
            {loveThese.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {loveThese.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-white/90 text-center py-10">
                No events found. Please check back later or contact a host to publish events.
              </div>
            )}

            {/* Category Sections */}
            {categoriesList
              .filter((c) => c !== 'All')
              .map((cat) => {
                const list = grouped[cat] || [];
                if (!list.length) return null;

                const isExpanded = expandedCategory === cat || showAllPerCategory;
                const visible = isExpanded ? list : list.slice(0, 3);
                const canShowMore = !isExpanded && list.length > 3;

                return (
                  <div key={cat} className="mt-10 sm:mt-12">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-white text-lg sm:text-xl font-semibold"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {cat}
                      </h3>

                      {canShowMore ? (
                        <button
                          type="button"
                          onClick={() => handleMoreForCategory(cat)}
                          className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          More <span className="align-middle">↗</span>
                        </button>
                      ) : isExpanded && !showAllPerCategory ? (
                        <button
                          type="button"
                          onClick={handleCollapseCategory}
                          className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          Show less
                        </button>
                      ) : (
                        <div className="text-xs sm:text-sm text-transparent select-none">.</div>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                      {visible.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Quick find */}
            <div className="mt-12 sm:mt-14">
              <div className="flex items-center gap-2">
                <h4
                  className="text-white text-lg font-semibold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Quick find
                </h4>
                <span className="text-pink-400" aria-hidden>🔎</span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                {/* Category */}
                <div className="relative">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full appearance-none rounded-xl bg-neutral-900 text-white border border-white/10 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    style={{ fontFamily: '"Poppins", sans-serif', colorScheme: 'dark' }}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat} className="bg-white text-black">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>

                {/* Date Range */}
                <div className="relative">
                  <select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    className="w-full appearance-none rounded-xl bg-neutral-900 text-white border border-white/10 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    style={{ fontFamily: '"Poppins", sans-serif', colorScheme: 'dark' }}
                  >
                    <option value="All" className="bg-white text-black">All Dates</option>
                    <option value="Today" className="bg-white text-black">Today</option>
                    <option value="ThisWeek" className="bg-white text-black">This Week</option>
                    <option value="ThisMonth" className="bg-white text-black">This Month</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>

                {/* Quick Search Button */}
                <button
                  onClick={() => fetchEvents(1)}
                  className="w-full rounded-xl text-white font-medium px-6 py-3 bg-gradient-to-r from-pink-600 to-red-500 hover:opacity-90 transition"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Global View More for pagination/all sections */}
            {shouldShowViewMore && (
              <button
                onClick={handleViewMore}
                className="text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 mt-10 block mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)',
                  fontFamily: '"Poppins", sans-serif',
                  borderRadius: '50px 50px 50px 0px',
                }}
              >
                View More
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;
