import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Ticket, Instagram, Twitter, X, ChevronLeft, ChevronRight } from 'lucide-react';

const EventDetails = () => {
  const { state } = useLocation();
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(state?.event || null);
  const [loading, setLoading] = useState(!state?.event);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch event if state.event is missing
  useEffect(() => {
    if (event || !eventName) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching event:', `https://genpay-sl25bd-1.onrender.com/api/events/public/slug/${eventName}`);
        const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/public/slug/${eventName}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
        console.log('Backend response:', data);

        if (data.status !== 'success' || !data.data.event) {
          throw new Error('Event not found or invalid response format');
        }

        const formattedEvent = {
          _id: data.data.event._id.toString(),
          title: data.data.event.eventName,
          description: data.data.event.eventDescription,
          date: data.data.event.startDateTime,
          startISO: data.data.event.startDateTime,
          location: data.data.event.eventLocation?.venue || 'Unknown Location',
          image: data.data.event.headerImage || 'https://via.placeholder.com/1080x1350?text=Event+Flyer',
          category: data.data.event.eventCategory,
          images: Array.isArray(data.data.event.images) ? data.data.event.images : [],
          socialLinks: data.data.event.socialLinks || {},
          tickets: Array.isArray(data.data.event.tickets) ? data.data.event.tickets : [],
          eventName: data.data.event.eventName,
          eventDescription: data.data.event.eventDescription,
          startDateTime: data.data.event.startDateTime,
          endDateTime: data.data.event.endDateTime,
          eventLocation: data.data.event.eventLocation || {},
          eventUrl: data.data.event.eventUrl || '',
          headerImage: data.data.event.headerImage,
          attendeesCount: data.data.event.attendeesCount ?? 0,
        };

        setEvent(formattedEvent);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventName, event]);

  // Early return for invalid eventName
  if (!eventName) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Invalid event URL. Please go back and select an event.
      </div>
    );
  }

  // Normalize fields
  const title = event ? event.eventName || event.title || 'Event' : 'Event';
  const description = event ? event.eventDescription || event.description || 'No description available.' : 'No description available.';
  const headerImage = event ? event.headerImage || event.image || '/placeholder.svg?height=250&width=200' : '/placeholder.svg?height=250&width=200';
  const venue = event ? event.eventLocation?.venue || event.location || 'Location TBA' : 'Location TBA';
  const locationTips = event ? event.eventLocation?.locationTips || '' : '';
  const address = event ? event.eventLocation?.address || {} : {};
  const addressLine = [address.street, address.city, address.state, address.country, address.zipCode].filter(Boolean).join(', ');
  const fullAddress = [venue, addressLine].filter(Boolean).join(', ');
  const images = event ? (Array.isArray(event.images) ? event.images.slice(0, 10) : []) : [];
  const social = event ? event.socialLinks || {} : {};
  const eventUrl = event ? event.eventUrl || '' : '';
  const attendees = event ? event.attendeesCount ?? 172 : 172;

  // Date/time formatting
  const start = event && event.startDateTime ? new Date(event.startDateTime) : (event && event.date ? new Date(event.date) : null);
  const end = event && event.endDateTime ? new Date(event.endDateTime) : null;
  const formattedDate = start && !isNaN(start.getTime())
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Africa/Lagos' }).format(start)
    : 'N/A';
  const formattedStartTime = start && !isNaN(start.getTime())
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Africa/Lagos' }).format(start)
    : 'N/A';
  const formattedEndTime = end && !isNaN(end.getTime())
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Africa/Lagos' }).format(end)
    : 'N/A';
  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();

  // Map embed
  const mapSrc = useMemo(() => {
    const query = encodeURIComponent(fullAddress || venue);
    return `https://www.google.com/maps?q=${query}&output=embed`;
  }, [fullAddress, venue]);

  // Lightbox callbacks
  const openLightbox = useCallback((index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const showPrev = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const showNext = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox, showPrev, showNext]);

  // Navigate to BuyTicket
  const handleGetTickets = () => {
    if (event?._id) {
      navigate(`/buy-ticket/${event._id}`, { state: { event } });
    } else {
      console.error('Event ID is missing');
      alert('Unable to proceed to ticket purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading event...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Event not found. Please go back and select an event.
      </div>
    );
  }

  const StatRow = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-3">
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
        aria-hidden
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-white/90">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-3 p-5">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Go back to Explore"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center gap-2 text-gray-300">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
            aria-hidden
          />
          <span className="text-sm sm:text-base" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {'/explore/'}{sanitizedTitle}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-14 space-y-10">
        <section className="relative">
          <div
            className="rounded-2xl p-4 sm:p-5 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="space-y-3 order-2 sm:order-1">
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {title}
                </h1>
                <p className="text-sm leading-relaxed text-white/90">
                  {description}
                </p>
              </div>

              <div className="order-1 sm:order-2 flex justify-start sm:justify-end">
                <img
                  src={headerImage}
                  alt={title}
                  width={200}
                  height={250}
                  className="rounded-lg object-cover shadow-2xl ring-4 ring-white/10 w-[140px] h-[175px] sm:w-[180px] sm:h-[225px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-5">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Event Details
            </h2>

            <div className="space-y-4">
              <StatRow icon={MapPin}>
                <div>
                  <p className="font-medium">{venue}</p>
                  {addressLine && <p className="text-gray-400 text-sm">{addressLine}</p>}
                  {locationTips && <p className="text-gray-400 text-sm italic">{locationTips}</p>}
                </div>
              </StatRow>

              <StatRow icon={Calendar}>
                <p className="font-medium">{formattedDate}</p>
              </StatRow>

              <StatRow icon={Clock}>
                <p className="font-medium">
                  {formattedStartTime} {formattedEndTime !== 'N/A' ? `- ${formattedEndTime}` : ''}
                </p>
              </StatRow>

              {Array.isArray(event.tickets) && event.tickets.length > 0 && (
                <StatRow icon={Ticket}>
                  <p className="font-medium">Tickets available</p>
                </StatRow>
              )}
            </div>

            {Array.isArray(event.tickets) && event.tickets.length > 0 ? (
              <button
                className="w-full md:w-auto px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold hover:opacity-90 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
                onClick={handleGetTickets}
                disabled={!event._id}
              >
                Get Tickets
              </button>
            ) : (
              <p className="text-gray-400 text-sm">No tickets available for this event.</p>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 aspect-square">
            <iframe
              title="Event Location Map"
              src={mapSrc}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {images.length > 0 && (
          <section className="space-y-4">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Gallery
            </h2>
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="rounded-xl overflow-hidden ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  aria-label={`Open image ${index + 1}`}
                >
                  <img
                    src={img || `/placeholder.svg?height=120&width=120&query=event gallery image ${index + 1}`}
                    alt={`Gallery image ${index + 1}`}
                    width={120}
                    height={120}
                    className="object-cover w-24 h-24 md:w-28 md:h-28"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {social && Object.values(social).some(Boolean) && (
          <section className="space-y-4">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Social
            </h2>
            <div className="flex items-center gap-5">
              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  {'🎵'}
                </a>
              )}
              {social.snapchat && (
                <a
                  href={social.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  {'👻'}
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {social.website && (
                <a
                  href={social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition text-sm font-medium"
                  aria-label="Website"
                  title="Website"
                >
                  www
                </a>
              )}
            </div>
          </section>
        )}

        <p className="text-gray-400 text-sm">
          {attendees} people have bought tickets for {title}. Be one of them!
        </p>

        {Array.isArray(event.tickets) && event.tickets.length > 0 ? (
          <button
            className="text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 mt-10 block mx-auto"
            style={{
              background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)',
              fontFamily: '"Poppins", sans-serif',
              borderRadius: '50px 50px 50px 0px',
            }}
            onClick={handleGetTickets}
            disabled={!event._id}
          >
            Get tickets
          </button>
        ) : (
          <p className="text-gray-400 text-sm text-center mt-10">
            No tickets available for this event.
          </p>
        )}

        <hr className="border-white/10" />
      </main>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7 text-white" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7 text-white" />
          </button>

          <div className="max-w-[92vw] max-h-[82vh]">
            <img
              src={images[currentIndex] || '/placeholder.svg?height=800&width=800&query=event image'}
              alt={`Image ${currentIndex + 1} of ${images.length}`}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;