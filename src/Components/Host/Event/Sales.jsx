// Components/Host/Event/Sales.jsx
"use client"

import { useEffect, useMemo, useState, useCallback, Component, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, ScanLine } from "lucide-react";
import { BrowserQRCodeReader, NotFoundException } from "@zxing/library";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          <p>QR Scanner Error: {this.state.errorMessage}</p>
          <p>Please try again or check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Custom debounce function
function debounce(func, wait) {
  let timeout;
  const debounced = function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
  };
  return debounced;
}

function formatNaira(n) {
  return `N${Number(n || 0).toLocaleString("en-NG")}`;
}

function formatDate(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB");
  } catch {
    return "—";
  }
}

function formatTime(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

const Sales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState("Event");
  const [checkins, setCheckins] = useState([]);
  const [guests, setGuests] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState("");
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /ipad|iphone|android/i.test(userAgent);
    setIsMobile(mobile);
    console.log("Device detected as mobile:", mobile);

    // Check for camera availability
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setCameraAvailable(hasCamera);
        console.log("Available cameras:", devices.filter(d => d.kind === 'videoinput'));
        if (!hasCamera) {
          setError("No camera detected. QR scanning is unavailable.");
        }
      })
      .catch(err => {
        console.error("Error checking camera availability:", err);
        setCameraAvailable(false);
        setError("Failed to access camera. Please check permissions or device settings.");
      });
  }, []);

  useEffect(() => {
    if (showScanner && cameraAvailable) {
      codeReader.current = new BrowserQRCodeReader();
      console.log("Initializing QR scanner...");
      codeReader.current
        .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          console.log("decodeFromVideoDevice callback triggered", { result, err });
          if (result) {
            console.log("QR code raw data:", result.getText());
            handleScan({ text: result.getText() });
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error("ZXing QR Scanner error:", err);
            setError(`Scanner error: ${err.message}`);
            setShowScanner(false);
          }
        })
        .catch(err => {
          console.error("ZXing initialization error:", err);
          setError(`Failed to initialize scanner: ${err.message}`);
          setShowScanner(false);
        });

      return () => {
        if (codeReader.current) {
          codeReader.current.reset();
          console.log("QR scanner reset");
        }
      };
    }
  }, [showScanner, cameraAvailable]);

  const handleScan = async (data) => {
    console.log("handleScan called with data:", data);
    if (!data || !data.text) {
      console.warn("No valid QR code data received:", data);
      setError("No valid QR code detected. Please try again.");
      setShowScanner(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in.");
        setShowScanner(false);
        return;
      }

      let qrCode = data.text;
      console.log("Raw QR code data:", qrCode);
      // Parse JSON if QR code is JSON-formatted
      try {
        const parsed = JSON.parse(qrCode);
        qrCode = parsed.ticketId || qrCode;
        console.log("Parsed QR code ticketId:", qrCode);
      } catch (e) {
        console.warn("QR code is not JSON, using raw text:", qrCode);
      }

      console.log("Sending QR code to backend:", qrCode);
      const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/scan-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrCode }),
      });

      const result = await response.json();
      console.log("Scan response:", result);
      if (result.status === 'success') {
        setSearchResults([{
          ...result.data.ticket,
          status: 'valid',
          color: 'green',
        }]);
        fetchAll();
      } else if (result.status === 'fail' && result.message.includes('already been used')) {
        setSearchResults([{
          ...result.data.ticket,
          status: 'used',
          color: 'red',
        }]);
      } else {
        setError(result.message || "Failed to scan ticket");
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError('Failed to scan ticket: ' + err.message);
    }
    setShowScanner(false);
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSearchResults([]);
        setError("");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token missing. Please log in.");
          return;
        }
        console.log("Searching for:", query, "Event ID:", id);
        const response = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/search-ticket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ search: query }),
        });

        const result = await response.json();
        console.log("Search response:", result);
        if (result.status === 'success') {
          setSearchResults(result.data.tickets || []);
          setError("");
          fetchAll();
        } else {
          setSearchResults([]);
          setError(result.message || "No matching tickets found");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError('Failed to search ticket: ' + err.message);
        setSearchResults([]);
      }
    }, 300),
    [id]
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token missing. Please log in.");
          return;
        }
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        console.log("Fetching data for event ID:", id);
        const [eventRes, checkinRes, ticketBuyersRes, payoutsRes] = await Promise.allSettled([
          fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}`, { headers }),
          fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/checkins`, { headers }),
          fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/ticket-buyers`, { headers }),
          fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${id}/payouts`, { headers }),
        ]);

        if (cancelled) return;

        if (eventRes.status === "fulfilled" && eventRes.value.ok) {
          const data = await eventRes.value.json();
          console.log("Event response:", data);
          const ev = data?.data?.event || data?.event || {};
          setEventTitle(ev.eventName || ev.title || "Event");
        } else {
          console.warn("Event fetch failed, status:", eventRes.status, eventRes.value?.status);
          setEventTitle("X Republik");
        }

        if (checkinRes.status === "fulfilled" && checkinRes.value.ok) {
          const data = await checkinRes.value.json();
          console.log("Checkins response:", data);
          const rows = data?.data?.checkins || data?.checkins || [];
          setCheckins(rows);
        } else {
          console.warn("Checkins fetch failed, status:", checkinRes.status, checkinRes.value?.status);
          setCheckins([]);
        }

        if (ticketBuyersRes.status === "fulfilled" && ticketBuyersRes.value.ok) {
          const data = await ticketBuyersRes.value.json();
          console.log("Ticket buyers response:", data);
          const rows = data?.data?.guests || data?.guests || [];
          setGuests(rows);
        } else {
          console.warn("Ticket buyers fetch failed, status:", ticketBuyersRes.status, ticketBuyersRes.value?.status);
          setGuests([]);
        }

        if (payoutsRes.status === "fulfilled" && payoutsRes.value.ok) {
          const data = await payoutsRes.value.json();
          console.log("Payouts response:", data);
          const rows = data?.data?.payouts || data?.payouts || [];
          setPayouts(rows);
        } else {
          console.warn("Payouts fetch failed, status:", payoutsRes.status, payoutsRes.value?.status);
          setPayouts([]);
          setError("Payouts data unavailable. Please check the backend configuration.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (!cancelled) setError(err.message || "Failed to load sales data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const totalGuests = guests.length;
  const checkedInCount = useMemo(() => guests.filter((g) => g.checkedIn).length, [guests]);
  const checkedInPercent = totalGuests ? Math.round((checkedInCount / totalGuests) * 100) : 0;

  const sanitizedTitle = useMemo(
    () =>
      (eventTitle || "event")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
    [eventTitle]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-3 p-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="flex items-center gap-2 text-gray-300">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)" }}
            aria-hidden
          />
          <span className="text-sm sm:text-base" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {eventTitle}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div
          className="rounded-xl px-4 py-3 inline-flex items-center gap-3 mb-6"
          style={{ background: "linear-gradient(135deg, #E9A4B0 0%, #FFB3B3 100%)", color: "#4A0A0A" }}
        >
          <Info className="h-5 w-5" />
          <span className="text-sm sm:text-base" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Manage your guest check-ins & payout summary here
          </span>
        </div>

        <div className="mb-6">
          <button
            onClick={() => cameraAvailable && setShowScanner(!showScanner)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              cameraAvailable ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-500 cursor-not-allowed'
            }`}
            disabled={!cameraAvailable}
          >
            <ScanLine className="h-5 w-5" />
            {showScanner ? 'Close Scanner' : 'Scan QR Code'}
          </button>
          {!isMobile && (
            <p className="text-sm text-gray-400 mt-2">
              Note: QR scanning requires a camera. Ensure you have a webcam and permissions enabled.
            </p>
          )}
          {!cameraAvailable && (
            <p className="text-sm text-red-500 mt-2">
              Camera unavailable. QR scanning is disabled.
            </p>
          )}
        </div>

        {showScanner && (
          <ErrorBoundary>
            <div className="mb-6">
              <video
                ref={videoRef}
                style={{ width: '100%', maxWidth: '400px' }}
                muted
                playsInline
              />
              <p className="text-sm text-gray-400 mt-2">
                Ensure the QR code is well-lit and in focus.
              </p>
            </div>
          </ErrorBoundary>
        )}

        <div className="mb-6 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by ticket ID or email"
            className="w-full px-4 py-2 rounded-lg bg-white/5 text-white"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 rounded-lg bg-white/10 backdrop-blur-sm max-h-60 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="p-4 border-b border-white/10 last:border-none"
                  style={{ background: result.status === 'valid' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}
                >
                  <p className="font-semibold">Ticket Status: {result.status.toUpperCase()}</p>
                  <p>Owner: {result.owner.firstName} {result.owner.lastName}</p>
                  <p>Email: {result.owner.email}</p>
                  <p>Ticket ID: {result.id}</p>
                </div>
              ))}
            </div>
          )}
          {error && searchInput && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <section className="mt-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Check-in Management</h2>
          <div className="w-full overflow-x-auto rounded-xl ring-1 ring-white/10 bg-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Guest Email</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Count</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-none">
                    <td className="px-4 py-3 text-white/90">{row.guestEmail || "—"}</td>
                    <td className="px-4 py-3 text-white/90">{formatDate(row.dateTime)}</td>
                    <td className="px-4 py-3 text-white/90">{formatTime(row.dateTime)}</td>
                    <td className="px-4 py-3 text-white/90">{row.count ?? 0}</td>
                    <td className="px-4 py-3 text-white/90">{formatNaira(row.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-3 py-1 text-xs text-gray-200 ${
                          row.status === 'Used' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      >
                        {row.status || "Used"}
                      </span>
                    </td>
                  </tr>
                ))}
                {checkins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                      No check-ins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-white/90">
            <span className="mr-6">Total Guests: {totalGuests}</span>
            <span>Checked In: {checkedInCount}</span>
            <span className="ml-6">Checked In %: {checkedInPercent}%</span>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Guest List
          </h2>
          <div className="w-full overflow-x-auto rounded-xl ring-1 bg-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-none">
                    <td className="px-4 py-3 text-white/90">{guest.name || "—"}</td>
                    <td className="px-4 py-3 text-white/90">{guest.email || "—"}</td>
                    <td className="px-4 py-3 text-white/90">{guest.phone || "—"}</td>
                    <td className="px-4 py-3 text-white/90">{guest.location || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-3 py-1 text-xs text-gray-200 ${
                          guest.checkedIn ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {guest.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </span>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      No guests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Your Payout Summary
          </h2>
          <div
            className="w-full overflow-x-auto rounded-xl p-0 ring-1 bg-white/5"
            style={{ border: "1px solid rgba(255, 0, 0, 0.4)" }}
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-none">
                    <td className="px-4 py-3 text-white/90">{formatDate(p.dateTime)}</td>
                    <td className="px-4 py-3 text-white/90">{formatTime(p.dateTime)}</td>
                    <td className="px-4 py-3 text-white/90">{p.account || "—"}</td>
                    <td className="px-4 py-3 text-white/90">{formatNaira(p.amount)}</td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                      No payouts recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sales;