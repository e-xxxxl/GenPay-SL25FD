// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Explore = () => {
//   const [events, setEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAllPerCategory, setShowAllPerCategory] = useState(false);
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [filters, setFilters] = useState({
//     category: 'All',
//     dateRange: 'All',
//   });

//   const navigate = useNavigate();

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Fetching events from: https://genpay-sl25bd-1.onrender.com/api/events/public');

//       const response = await fetch('https://genpay-sl25bd-1.onrender.com/api/events/public', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.log('Response status:', response.status, 'Response text:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('Backend response:', data);

//       if (data.status !== 'success' || !data.data || !Array.isArray(data.data.events)) {
//         throw new Error('Invalid response format or no events found: ', data);
//       }

//       const formattedEvents = data.data.events.map((event) => ({
//         _id: event._id.toString(),
//         title: event.eventName || 'Unnamed Event',
//         description: event.eventDescription || 'No description',
//         date: event.startDateTime
//           ? new Date(event.startDateTime).toLocaleString('en-US', {
//               day: 'numeric',
//               month: 'short',
//               year: 'numeric',
//               hour: 'numeric',
//               minute: '2-digit',
//               hour12: true,
//               timeZone: 'Africa/Lagos',
//             })
//           : 'No Date',
//         startISO: event.startDateTime || null,
//         location: (event.eventLocation && event.eventLocation.venue) || 'Unknown Location',
//         image: event.headerImage || 'https://via.placeholder.com/1080x1350?text=Event+Flyer',
//         category: event.eventCategory,
//         images: event.images || [],
//         socialLinks: event.socialLinks || {},
//         tickets: event.tickets || [],
//         slug: event.slug || event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim(),
//       }));

//       console.log('Formatted events:', formattedEvents);
//       setEvents(formattedEvents);
//     } catch (err) {
//       console.error('Error fetching events:', err);
//       setError(err.message || 'Failed to load events. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleMoreForCategory = (cat) => {
//     setExpandedCategory(cat);
//   };

//   const handleCollapseCategory = () => setExpandedCategory(null);

//   const handleEventClick = (event) => {
//     const slug = event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
//     navigate(`/explore/${slug}`, { state: { event } });
//   };

//   // Date helpers for dropdown filters
//   const isToday = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date.toDateString() === today.toDateString();
//   };

//   const isThisWeek = (date) => {
//     const today = new Date();
//     const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
//     const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59);
//     return date >= startOfWeek && date <= endOfWeek;
//   };

//   const isThisMonth = (date) => {
//     const today = new Date();
//     return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const categoriesList = [
//     'All',
//     'Music',
//     'Sports',
//     'Business',
//     'Technology',
//     'Art & Culture',
//     'Food & Drink',
//     'Health & Wellness',
//     'Education',
//     'Entertainment',
//     'Networking',
//     'Other',
//   ];

//   const normalized = (c) => (c && String(c).trim()) || 'Other';

//   // Apply search/category/date-range filters
//   const filteredEvents = events.filter((event) => {
//     const matchesSearch =
//       event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.location.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = filters.category === 'All' || normalized(event.category) === filters.category;

//     const matchesDate =
//       filters.dateRange === 'All' ||
//       (filters.dateRange === 'Today' && isToday(new Date(event.startISO))) ||
//       (filters.dateRange === 'ThisWeek' && isThisWeek(new Date(event.startISO))) ||
//       (filters.dateRange === 'ThisMonth' && isThisMonth(new Date(event.startISO)));

//     return matchesSearch && matchesCategory && matchesDate;
//   });

//   // "We think you'll love these" (display 4)
//   const loveThese = filteredEvents.slice(0, 4);

//   // Group by category
//   const categoriesToRender = categoriesList.filter((c) => c !== 'All');
//   const grouped = categoriesToRender.reduce((acc, cat) => {
//     acc[cat] = filteredEvents.filter((ev) => normalized(ev.category) === cat);
//     return acc;
//   }, {});
//   const known = new Set(categoriesToRender);
//   const extras = filteredEvents.filter((ev) => !known.has(normalized(ev.category)));
//   if (extras.length) {
//     grouped['Other'] = [...(grouped['Other'] || []), ...extras];
//   }

//   // Reusable flyer-styled card
//   const EventCard = ({ event }) => (
//     <div
//       className="relative group rounded-[20px] overflow-hidden bg-neutral-900 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 cursor-pointer"
//       onClick={() => handleEventClick(event)}
//     >
//       <div className="relative w-full aspect-[4/5] overflow-hidden">
//         <img
//           src={event.image || '/placeholder.svg'}
//           alt={event.title}
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/90" />
//       </div>
//       <div className="absolute inset-x-0 bottom-0 p-4">
//         <h4
//           className="text-white text-base sm:text-lg font-semibold line-clamp-2"
//           style={{ fontFamily: '"Poppins", sans-serif' }}
//         >
//           {event.title}
//         </h4>
//         <div className="mt-2 flex flex-wrap items-center gap-2">
//           <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-pink-600/20 text-pink-300">
//             {event.date}
//           </span>
//           <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-emerald-500/20 text-emerald-300">
//             {event.location}
//           </span>
//           {event.category ? (
//             <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-purple-500/20 text-purple-300">
//               {normalized(event.category)}
//             </span>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="bg-black py-10 sm:py-14 md:py-18 lg:py-20">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2
//           className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl"
//           style={{ fontFamily: '"Poppins", sans-serif' }}
//         >
//           Discover and secure tickets to the hottest
//           <br className="hidden sm:block" /> events, all in one place
//         </h2>

//         <div className="max-w-3xl mt-6">
//           <div className="relative">
//             <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
//               <span class="material-symbols-outlined">
// search
// </span>
//             </span>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Search"
//               className="w-full h-12 sm:h-14 rounded-full bg-white text-black pl-12 pr-4 text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             />
//           </div>
//         </div>

//         <div className="mt-10 sm:mt-12 flex items-center justify-between">
//           <h3
//             className="text-white text-lg sm:text-xl font-semibold"
//             style={{ fontFamily: '"Poppins", sans-serif' }}
//           >
//             We think you'll love these
//           </h3>
//           <div
//             className="text-xs sm:text-sm text-gray-400 select-none"
//             style={{ fontFamily: '"Poppins", sans-serif' }}
//           >
//             {/* More <span className="align-middle">↗</span> */}
//           </div>
//         </div>

//         {loading && !error && <div className="text-white text-center py-10">Loading events...</div>}

//         {error && !loading && (
//           <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mt-6 shadow-md">
//             <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
//               Error: {error}
//             </p>
//           </div>
//         )}

//         {!loading && !error && (
//           <>
//             {loveThese.length > 0 ? (
//               <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
//                 {loveThese.map((event) => (
//                   <EventCard key={event._id} event={event} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-white/90 text-center py-10">
//                 No events found. Please check back later or contact a host to publish events.
//               </div>
//             )}

//             {categoriesList
//               .filter((c) => c !== 'All')
//               .map((cat) => {
//                 const list = grouped[cat] || [];
//                 if (!list.length) return null;

//                 const isExpanded = expandedCategory === cat || showAllPerCategory;
//                 const visible = isExpanded ? list : list.slice(0, 3);
//                 const canShowMore = !isExpanded && list.length > 3;

//                 return (
//                   <div key={cat} className="mt-10 sm:mt-12">
//                     <div className="flex items-center justify-between">
//                       <h3
//                         className="text-white text-lg sm:text-xl font-semibold"
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       >
//                         {cat}
//                       </h3>

//                       {canShowMore ? (
//                         <button
//                           type="button"
//                           onClick={() => handleMoreForCategory(cat)}
//                           className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
//                           style={{ fontFamily: '"Poppins", sans-serif' }}
//                         >
//                           {/* More <span className="align-middle">↗</span> */}
//                         </button>
//                       ) : isExpanded && !showAllPerCategory ? (
//                         <button
//                           type="button"
//                           onClick={handleCollapseCategory}
//                           className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
//                           style={{ fontFamily: '"Poppins", sans-serif' }}
//                         >
//                           Show less
//                         </button>
//                       ) : (
//                         <div className="text-xs sm:text-sm text-transparent select-none">.</div>
//                       )}
//                     </div>

//                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
//                       {visible.map((event) => (
//                         <EventCard key={event._id} event={event} />
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}

//             <div className="mt-12 sm:mt-14">
//               <div className="flex items-center gap-2">
//                 <h4
//                   className="text-white text-lg font-semibold"
//                   style={{ fontFamily: '"Poppins", sans-serif' }}
//                 >
//                   Quick find
//                 </h4>
                
//               </div>

//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
//                 <div className="relative">
//                   <select
//                     name="category"
//                     value={filters.category}
//                     onChange={handleFilterChange}
//                     className="w-full appearance-none rounded-xl bg-neutral-900 text-white border border-white/10 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                     style={{ fontFamily: '"Poppins", sans-serif', colorScheme: 'dark' }}
//                   >
//                     {categoriesList.map((cat) => (
//                       <option key={cat} value={cat} className="bg-white text-black">
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                   <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//                 </div>

//                 <div className="relative">
//                   <select
//                     name="dateRange"
//                     value={filters.dateRange}
//                     onChange={handleFilterChange}
//                     className="w-full appearance-none rounded-xl bg-neutral-900 text-white border border-white/10 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                     style={{ fontFamily: '"Poppins", sans-serif', colorScheme: 'dark' }}
//                   >
//                     <option value="All" className="bg-white text-black">All Dates</option>
//                     <option value="Today" className="bg-white text-black">Today</option>
//                     <option value="ThisWeek" className="bg-white text-black">This Week</option>
//                     <option value="ThisMonth" className="bg-white text-black">This Month</option>
//                   </select>
//                   <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//                 </div>

              
//               </div>
//               <div className='mt-10'>
//                 <button
//                   onClick={() => fetchEvents()}
//                   className="w-full "
//                   style={{ fontFamily: '"Poppins", sans-serif' }}
//                 >
//                   Refresh
//                 </button>
//                 </div>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Explore;



import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Cache helpers (localStorage + 5 min TTL)
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'explore-events-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedEvents = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
};

const setCachedEvents = (events) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: events, timestamp: Date.now() }));
  } catch (err) {
    console.warn('Failed to cache events:', err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Skeleton Card (instant placeholder)
// ─────────────────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="relative rounded-[20px] overflow-hidden bg-neutral-900 animate-pulse">
    <div className="aspect-[4/5] bg-neutral-800" />
    <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
      <div className="h-5 bg-neutral-700 rounded w-3/4" />
      <div className="h-4 bg-neutral-700 rounded w-1/2" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Main Explore Component
// ─────────────────────────────────────────────────────────────────────────────
const Explore = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPerCategory, setShowAllPerCategory] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    dateRange: 'All',
  });

  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────────────────
  // Fetch Events – Cache-first + Background Refresh
  // ─────────────────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events from: https://genpay-sl25bd-1.onrender.com/api/events/public');

      // 1. Try cache first (unless forced)
      if (!force) {
        const cached = getCachedEvents();
        if (cached) {
          setEvents(cached);
          setLoading(false);
          // Refresh in background
          void fetchEvents(true);
          return;
        }
      }

      const response = await fetch('https://genpay-sl25bd-1.onrender.com/api/events/public', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
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
          ? new Date(event.startDateTime).toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Africa/Lagos',
            })
          : 'No Date',
        startISO: event.startDateTime || null,
        location: (event.eventLocation && event.eventLocation.venue) || 'Unknown Location',
        image: event.headerImage || 'https://via.placeholder.com/1080x1350?text=Event+Flyer',
        category: event.eventCategory,
        images: event.images || [],
        socialLinks: event.socialLinks || {},
        tickets: event.tickets || [],
        slug: event.slug || event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim(),
      }));

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
      setCachedEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMoreForCategory = (cat) => {
    setExpandedCategory(cat);
  };

  const handleCollapseCategory = () => setExpandedCategory(null);

  const handleEventClick = (event) => {
    const slug = event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
    navigate(`/explore/${slug}`, { state: { event } });
  };

  // Date helpers for dropdown filters
  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

  // Apply search/category/date-range filters
  const filteredEvents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term);

      const matchesCategory = filters.category === 'All' || normalized(event.category) === filters.category;

      const matchesDate =
        filters.dateRange === 'All' ||
        (filters.dateRange === 'Today' && isToday(new Date(event.startISO))) ||
        (filters.dateRange === 'ThisWeek' && isThisWeek(new Date(event.startISO))) ||
        (filters.dateRange === 'ThisMonth' && isThisMonth(new Date(event.startISO)));

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [events, searchTerm, filters]);

  // "We think you'll love these" (display 4)
  const loveThese = filteredEvents.slice(0, 4);

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

  // Group by category
  const grouped = useMemo(() => {
    const categoriesToRender = categoriesList.filter((c) => c !== 'All');
    const grouped = categoriesToRender.reduce((acc, cat) => {
      acc[cat] = filteredEvents.filter((ev) => normalized(ev.category) === cat);
      return acc;
    }, {});
    const known = new Set(categoriesToRender);
    const extras = filteredEvents.filter((ev) => !known.has(normalized(ev.category)));
    if (extras.length) {
      grouped['Other'] = [...(grouped['Other'] || []), ...extras];
    }
    return grouped;
  }, [filteredEvents]);

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

  return (
    <section className="bg-black py-10 sm:py-14 md:py-18 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Discover and secure tickets to the hottest
          <br className="hidden sm:block" /> events, all in one place
        </h2>

        <div className="max-w-3xl mt-6">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <span class="material-symbols-outlined">
search
</span>
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
            {/* More <span className="align-middle">↗</span> */}
          </div>
        </div>

        {loading && !error && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mt-6 shadow-md">
            <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Error: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
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
                          {/* More <span className="align-middle">↗</span> */}
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

            <div className="mt-12 sm:mt-14">
              <div className="flex items-center gap-2">
                <h4
                  className="text-white text-lg font-semibold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Quick find
                </h4>
                
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
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

              
              </div>
              <div className='mt-10'>
                <button
                  onClick={() => fetchEvents(true)}
                  className="w-full "
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Refresh
                </button>
                </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;