// // components/Wallett.jsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Wallet, CreditCard, X } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Wallett = () => {
//   const [user, setUser] = useState(null);
//   const [payoutInfo, setPayoutInfo] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [payouts, setPayouts] = useState([]);
//   const [ticketsSold, setTicketsSold] = useState(0);
//   const [balance, setBalance] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [withdrawForm, setWithdrawForm] = useState({ amount: "" });
//   const [formError, setFormError] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const navigate = useNavigate();
//   const modalRef = useRef(null);
//   const amountInputRef = useRef(null);

//   const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com";

//   // Refresh token function
//   const refreshToken = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       localStorage.setItem("token", response.data.token);
//       return response.data.token;
//     } catch (err) {
//       console.error("Token refresh failed:", err.response?.data);
//       localStorage.removeItem("token");
//       setError("Session expired. Please log in again.");
//       navigate("/login");
//       return null;
//     }
//   };

//   // Fetch wallet data
//  useEffect(() => {
//   const fetchData = async (retryCount = 0, maxRetries = 2) => {
//     try {
//       let token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please log in to view your wallet.");
//         navigate("/login");
//         return;
//       }

//       // Fetch user
//       let userData;
//       try {
//         const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         userData = userResponse.data.data.user;
//         setUser(userData);
//       } catch (userError) {
//         if (userError.response?.status === 401) {
//           token = await refreshToken();
//           if (!token) return;
//           const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           userData = userResponse.data.data.user;
//           setUser(userData);
//         } else {
//           throw userError;
//         }
//       }

//       // Fetch payout info
//       try {
//         const payoutResponse = await axios.get(`${API_BASE_URL}/api/payouts/payout-info`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPayoutInfo(payoutResponse.data.data);
//       } catch (payoutError) {
//         console.log("No payout info found:", payoutError.response?.data?.message);
//       }

//       // Fetch wallet data
//       const walletResponse = await axios.get(`${API_BASE_URL}/api/payouts/wallet`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const { events, payouts, totalTickets, balance } = walletResponse.data.data;

//       if (!Number.isFinite(balance)) {
//         console.error('Invalid balance received:', balance);
//         throw new Error('Invalid wallet balance data');
//       }

//       setEvents(events);
//       setPayouts(payouts);
//       setTicketsSold(totalTickets);
//       setBalance(balance);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching wallet data:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       if (err.response?.status === 401) {
//         const token = await refreshToken();
//         if (!token) return;
//         if (retryCount < maxRetries) {
//           setTimeout(() => fetchData(retryCount + 1, maxRetries), 2000);
//         } else {
//           setError("Session expired. Please log in again.");
//           navigate("/login");
//         }
//       } else if (retryCount < maxRetries && (err.response?.status >= 500 || err.message.includes("timed out"))) {
//         setTimeout(() => fetchData(retryCount + 1, maxRetries), 2000);
//       } else {
//         setError(err.response?.data?.message || "Failed to load wallet data. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchData();
// }, [navigate]);

//   // Handle modal close
//   const handleCloseModal = () => {
//     setShowWithdrawModal(false);
//     setWithdrawForm({ amount: "" });
//     setFormError(null);
//   };

//   // Handle form input changes
//   const handleWithdrawFormChange = (e) => {
//     const { name, value } = e.target;
//     setWithdrawForm((prev) => ({ ...prev, [name]: value }));
//     setFormError(null);
//   };

//   // Handle withdrawal form submission
//   const handleWithdrawFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!payoutInfo) {
//       setFormError("Please add payout information in the Account settings before withdrawing.");
//       return;
//     }

//     const amount = parseFloat(withdrawForm.amount);
//     if (!Number.isFinite(amount) || amount < 150) {
//       setFormError("Withdrawal amount must be at least 150 NGN to cover the withdrawal fee.");
//       return;
//     }
//     if (amount > balance) {
//       setFormError(`Withdrawal amount (${amount} NGN) exceeds available balance (${balance} NGN).`);
//       return;
//     }

//     setFormLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setFormError("Please log in to proceed with withdrawal.");
//         navigate("/login");
//         return;
//       }
//       const response = await axios.post(
//         `${API_BASE_URL}/api/payouts/withdraw`,
//         { amount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setBalance(response.data.data.balance);
//       setPayouts((prev) => [...prev, response.data.data.payout]);
//       setShowWithdrawModal(false);
//       setWithdrawForm({ amount: "" });
//       setFormError(null);
//       alert("Withdrawal request submitted successfully. You'll receive an email confirmation.");
//     } catch (err) {
//       if (err.response?.status === 401) {
//         const token = await refreshToken();
//         if (!token) return;
//         setFormError("Session expired. Please log in again.");
//         navigate("/login");
//       } else {
//         setFormError(err.response?.data?.message || "Failed to process withdrawal request.");
//       }
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat("en-NG", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date(date));
//   };

//   // Aggregate tickets by name, type, and price
//   const aggregateTickets = (tickets) => {
//     const ticketMap = new Map();
//     tickets.forEach((ticket) => {
//       const key = `${ticket.name}|${ticket.type}|${ticket.price}`;
//       if (!ticketMap.has(key)) {
//         ticketMap.set(key, {
//           name: ticket.name,
//           type: ticket.type,
//           price: ticket.price,
//           totalSold: 0,
//         });
//       }
//       ticketMap.get(key).totalSold += ticket.quantity;
//     });
//     return Array.from(ticketMap.values());
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading wallet...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400">{error}</p>
//           {error.includes("log in") ? (
//             <button
//               onClick={() => navigate("/login")}
//               className="mt-2 text-sm text-pink-600 hover:text-pink-400"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//               aria-label="Go to login page"
//             >
//               Log In
//             </button>
//           ) : (
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-2 text-sm text-pink-600 hover:text-pink-400"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//               aria-label="Retry loading wallet data"
//             >
//               Retry
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
//           Wallet
//         </h1>

//         {/* Summary Section */}
//         <div className="bg-white/5 border border-gray-700 rounded-lg p-6 mb-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <h2 className="text-lg text-gray-400">Total Tickets Sold</h2>
//               <p className="text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {ticketsSold}
//               </p>
//             </div>
//             <div>
//               <h2 className="text-lg text-gray-400">Account Balance</h2>
//               <p className="text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                 {formatCurrency(balance)}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               if (!payoutInfo) {
//                 alert("Please add payout information in the Account settings before withdrawing.");
//                 navigate("/account");
//               } else {
//                 setShowWithdrawModal(true);
//                 setTimeout(() => amountInputRef.current?.focus(), 100);
//               }
//             }}
//             className="mt-6 px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
//             style={{
//               background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
//               fontFamily: '"Poppins", sans-serif',
//               borderRadius: "15px 15px 15px 0px",
//             }}
//             disabled={balance < 150}
//             aria-label="Withdraw funds"
//           >
//             Withdraw Funds
//           </button>
//         </div>

//         {/* Event Revenue Breakdown */}
//         <div className="bg-white/5 border border-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
//             Event Revenue Breakdown
//           </h2>
//           {events.length === 0 ? (
//             <p className="text-gray-400">No events found.</p>
//           ) : (
//             <div className="space-y-6">
//               {events.map((event) => (
//                 <div key={event.id} className="border-b border-gray-700 pb-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="font-medium text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                       {event.eventName}
//                     </p>
//                     <p className="font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                       {formatCurrency(event.revenue)}
//                     </p>
//                   </div>
//                   <div className="ml-4">
//                     {event.tickets.length === 0 ? (
//                       <p className="text-sm text-gray-400">No tickets sold for this event.</p>
//                     ) : (
//                       <ul className="list-disc list-inside text-sm text-gray-400">
//                         {aggregateTickets(event.tickets).map((ticket, index) => (
//                           <li key={index}>
//                              {ticket.name} ({ticket.type}) {ticket.totalSold} sold @ {formatCurrency(ticket.price)} each
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Withdrawal History */}
//         <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
//             Withdrawal History
//           </h2>
//           {payouts.length === 0 ? (
//             <p className="text-gray-400">No withdrawals made.</p>
//           ) : (
//             <div className="space-y-4">
//               {payouts.map((payout) => (
//                 <div
//                   key={payout._id}
//                   className="flex justify-between items-center border-b border-gray-700 pb-2"
//                 >
//                   <div>
//                     <p className="font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                       {formatCurrency(payout.amount)} (Net: {formatCurrency(payout.netAmount)})
//                     </p>
//                     <p className="text-sm text-gray-400">
//                       Status: {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)} | {formatDate(payout.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Withdrawal Modal */}
//         {showWithdrawModal && (
//           <div
//             className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
//             role="dialog"
//             aria-labelledby="withdraw-modal-title"
//             aria-modal="true"
//           >
//             <div
//               ref={modalRef}
//               className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-md"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 id="withdraw-modal-title" className="text-white text-lg font-semibold">
//                   Withdraw Funds
//                 </h3>
//                 <button
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-white transition"
//                   aria-label="Close withdrawal modal"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <form onSubmit={handleWithdrawFormSubmit} className="space-y-4">
//                 <div>
//                   <label htmlFor="amount" className="text-gray-400 text-sm">
//                     Withdrawal Amount (NGN)
//                   </label>
//                   <input
//                     id="amount"
//                     type="number"
//                     name="amount"
//                     value={withdrawForm.amount}
//                     onChange={handleWithdrawFormChange}
//                     className="w-full bg-white/5 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                     style={{ fontFamily: '"Poppins", sans-serif' }}
//                     placeholder="Enter amount (min 150 NGN)"
//                     disabled={formLoading}
//                     ref={amountInputRef}
//                     aria-required="true"
//                     min="150"
//                   />
//                 </div>
//                 <div className="text-gray-400 text-sm">
//                   <p><strong>Note:</strong> A 150 NGN withdrawal fee applies. Processing takes 2-3 business days.</p>
//                   <p className="mt-2">
//                     <strong>Payout Details:</strong><br />
//                     Bank: {payoutInfo.bankName}<br />
//                     Account Name: {payoutInfo.accountName}<br />
//                     Account Number: {payoutInfo.accountNumber}
//                   </p>
//                   <p className="mt-2">
//                     <a
//                       href="/account"
//                       className="text-pink-600 hover:text-pink-400"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         navigate("/account");
//                       }}
//                     >
//                       Update payout details
//                     </a>
//                   </p>
//                 </div>
//                 {formError && (
//                   <p className="text-red-400 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
//                     {formError}
//                   </p>
//                 )}
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="px-4 py-2 text-gray-400 hover:text-white transition"
//                     style={{ fontFamily: '"Poppins", sans-serif' }}
//                     disabled={formLoading}
//                     aria-label="Cancel withdrawal"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading || !withdrawForm.amount || withdrawForm.amount < 150}
//                     className="px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
//                     style={{
//                       background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
//                       fontFamily: '"Poppins", sans-serif',
//                       borderRadius: "15px 15px 15px 0px",
//                     }}
//                     aria-label="Submit withdrawal request"
//                   >
//                     {formLoading ? "Processing..." : "Withdraw"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wallett;




"use client";

import { useState, useEffect, useRef } from "react";
import { Wallet, CreditCard, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wallett = () => {
  const [user, setUser] = useState(null);
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ amount: "" });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const amountInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://genpay-sl25bd-1.onrender.com";

  // Refresh token function
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data);
      localStorage.removeItem("token");
      setError("Session expired. Please log in again.");
      navigate("/login");
      return null;
    }
  };

  // Fetch wallet data
 useEffect(() => {
  const fetchData = async (retryCount = 0, maxRetries = 2) => {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your wallet.");
        navigate("/login");
        return;
      }

      // Fetch user
      let userData;
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userData = userResponse.data.data.user;
        setUser(userData);
      } catch (userError) {
        if (userError.response?.status === 401) {
          token = await refreshToken();
          if (!token) return;
          const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          userData = userResponse.data.data.user;
          setUser(userData);
        } else {
          throw userError;
        }
      }

      // Fetch payout info
      try {
        const payoutResponse = await axios.get(`${API_BASE_URL}/api/payouts/payout-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayoutInfo(payoutResponse.data.data);
      } catch (payoutError) {
        console.log("No payout info found:", payoutError.response?.data?.message);
      }

      // Fetch wallet data
      const walletResponse = await axios.get(`${API_BASE_URL}/api/payouts/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { events, payouts, totalTickets, balance } = walletResponse.data.data;

      if (!Number.isFinite(balance)) {
        console.error('Invalid balance received:', balance);
        throw new Error('Invalid wallet balance data');
      }

      setEvents(events);
      setPayouts(payouts);
      setTicketsSold(totalTickets);
      setBalance(balance);
      setError(null);
    } catch (err) {
      console.error("Error fetching wallet data:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        const token = await refreshToken();
        if (!token) return;
        if (retryCount < maxRetries) {
          setTimeout(() => fetchData(retryCount + 1, maxRetries), 2000);
        } else {
          setError("Session expired. Please log in again.");
          navigate("/login");
        }
      } else if (retryCount < maxRetries && (err.response?.status >= 500 || err.message.includes("timed out"))) {
        setTimeout(() => fetchData(retryCount + 1, maxRetries), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load wallet data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [navigate]);

  // Handle modal close
  const handleCloseModal = () => {
    setShowWithdrawModal(false);
    setWithdrawForm({ amount: "" });
    setFormError(null);
  };

  // Handle form input changes
  const handleWithdrawFormChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  // Handle withdrawal form submission
  const handleWithdrawFormSubmit = async (e) => {
    e.preventDefault();
    if (!payoutInfo) {
      setFormError("Please add payout information in the Account settings before withdrawing.");
      return;
    }

    const amount = parseFloat(withdrawForm.amount);
    if (!Number.isFinite(amount) || amount < 150) {
      setFormError("Withdrawal amount must be at least 150 NGN to cover the withdrawal fee.");
      return;
    }
    if (amount > balance) {
      setFormError(`Withdrawal amount (${amount} NGN) exceeds available balance (${balance} NGN).`);
      return;
    }

    setFormLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFormError("Please log in to proceed with withdrawal.");
        navigate("/login");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/payouts/withdraw`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(response.data.data.balance);
      setPayouts((prev) => [...prev, response.data.data.payout]);
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: "" });
      setFormError(null);
      alert("Withdrawal request submitted successfully. You'll receive an email confirmation.");
    } catch (err) {
      if (err.response?.status === 401) {
        const token = await refreshToken();
        if (!token) return;
        setFormError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setFormError(err.response?.data?.message || "Failed to process withdrawal request.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Aggregate tickets by name, type, and price
  const aggregateTickets = (tickets) => {
    const ticketMap = new Map();
    tickets.forEach((ticket) => {
      const key = `${ticket.name}|${ticket.type}|${ticket.price}`;
      if (!ticketMap.has(key)) {
        ticketMap.set(key, {
          name: ticket.name,
          type: ticket.type,
          price: ticket.price,
          totalSold: 0,
        });
      }
      ticketMap.get(key).totalSold += ticket.quantity;
    });
    return Array.from(ticketMap.values());
  };

  // Check if current time allows withdrawal (Wed/Sun 10 AM - 12 AM WAT)
  const now = new Date();
  const day = now.getUTCDay(); // 0-6, Sunday is 0, Wednesday is 3
  const hour = now.getUTCHours() + 1; // Adjust for WAT (UTC+1)
  const isWithdrawalTime = (day === 3 || day === 0) && hour >= 10 && hour < 24;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading wallet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          {error.includes("log in") ? (
            <button
              onClick={() => navigate("/login")}
              className="mt-2 text-sm text-pink-600 hover:text-pink-400"
              style={{ fontFamily: '"Poppins", sans-serif' }}
              aria-label="Go to login page"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-pink-600 hover:text-pink-400"
              style={{ fontFamily: '"Poppins", sans-serif' }}
              aria-label="Retry loading wallet data"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
          Wallet
        </h1>

        {/* Summary Section */}
        <div className="bg-white/5 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg text-gray-400">Total Tickets Sold</h2>
              <p className="text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {ticketsSold}
              </p>
            </div>
            <div>
              <h2 className="text-lg text-gray-400">Account Balance</h2>
              <p className="text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!payoutInfo) {
                alert("Please add payout information in the Account settings before withdrawing.");
                navigate("/account");
              } else {
                setShowWithdrawModal(true);
                setTimeout(() => amountInputRef.current?.focus(), 100);
              }
            }}
            className="mt-6 px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
              fontFamily: '"Poppins", sans-serif',
              borderRadius: "15px 15px 15px 0px",
            }}
            disabled={balance < 150 || !isWithdrawalTime}
            aria-label="Withdraw funds"
          >
            Withdraw Funds
          </button>
          <p className="text-sm text-gray-400 mt-2">Note: You can only make payout requests on a Wednesday and Sunday from 10 AM to 12 AM.</p>
        </div>

        {/* Event Revenue Breakdown */}
        <div className="bg-white/5 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Event Revenue Breakdown
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-400">No events found.</p>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="border-b border-gray-700 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {event.eventName}
                    </p>
                    <p className="font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {formatCurrency(event.revenue)}
                    </p>
                  </div>
                  <div className="ml-4">
                    {event.tickets.length === 0 ? (
                      <p className="text-sm text-gray-400">No tickets sold for this event.</p>
                    ) : (
                      <ul className="list-disc list-inside text-sm text-gray-400">
                        {aggregateTickets(event.tickets).map((ticket, index) => (
                          <li key={index}>
                             {ticket.name} ({ticket.type}) {ticket.totalSold} sold @ {formatCurrency(ticket.price)} each
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Withdrawal History
          </h2>
          {payouts.length === 0 ? (
            <p className="text-gray-400">No withdrawals made.</p>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout._id}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <div>
                    <p className="font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {formatCurrency(payout.amount)} (Net: {formatCurrency(payout.netAmount)})
                    </p>
                    <p className="text-sm text-gray-400">
                      Status: {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)} | {formatDate(payout.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="withdraw-modal-title"
            aria-modal="true"
          >
            <div
              ref={modalRef}
              className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-md"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 id="withdraw-modal-title" className="text-white text-lg font-semibold">
                  Withdraw Funds
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Close withdrawal modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleWithdrawFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="text-gray-400 text-sm">
                    Withdrawal Amount (NGN)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={withdrawForm.amount}
                    onChange={handleWithdrawFormChange}
                    className="w-full bg-white/5 text-white border border-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                    placeholder="Enter amount (min 150 NGN)"
                    disabled={formLoading}
                    ref={amountInputRef}
                    aria-required="true"
                    min="150"
                  />
                </div>
                <div className="text-gray-400 text-sm">
                  <p><strong>Note:</strong> A 150 NGN withdrawal fee applies. Processing takes 2-3 business days.</p>
                  <p className="mt-2">
                    <strong>Payout Details:</strong><br />
                    Bank: {payoutInfo.bankName}<br />
                    Account Name: {payoutInfo.accountName}<br />
                    Account Number: {payoutInfo.accountNumber}
                  </p>
                  <p className="mt-2">
                    <a
                      href="/account"
                      className="text-pink-600 hover:text-pink-400"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/account");
                      }}
                    >
                      Update payout details
                    </a>
                  </p>
                  <p className="mt-2">Note: You can only make payout requests on a Wednesday and Sunday from 10 AM to 12 AM.</p>
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
                    aria-label="Cancel withdrawal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || !withdrawForm.amount || withdrawForm.amount < 150}
                    className="px-4 py-2 text-white font-medium rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "15px 15px 15px 0px",
                    }}
                    aria-label="Submit withdrawal request"
                  >
                    {formLoading ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallett;