import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event ?? null;
  const tickets = Array.isArray(state?.tickets) ? state.tickets : [];
  const items = Array.isArray(state?.items) ? state.items : [];
  const subtotal = typeof state?.subtotal === 'number' ? state.subtotal : 0;
  const fees = typeof state?.fees === 'number' ? state.fees : 0;
  const total = typeof state?.total === 'number' ? state.total : subtotal + fees;
  const reference = state?.reference || 'N/A';
  const transaction = state?.transaction ?? null;

  const title = event?.eventName || event?.title || 'Event';
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

  const handleDownloadQR = async (qrCodeUrl, ticketId) => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${ticketId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  // Group tickets by email to display per attendee
  const ticketsByEmail = tickets.reduce((acc, ticket) => {
    const email = ticket.buyerEmail || 'Unknown';
    const buyerName = ticket.buyerName || 'Unknown Attendee';
    if (!acc[email]) {
      acc[email] = {
        buyerName,
        tickets: [],
      };
    }
    acc[email].tickets.push(ticket);
    return acc;
  }, {});

  console.log('Success component state:', state);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-3 p-5">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Back to Explore"
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

      <main className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h1
          className="text-2xl sm:text-3xl font-semibold mb-6"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Payment Successful
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <p className="text-gray-300 mb-4">
              Thank you for your purchase! Your transaction (Reference: {reference}) has been successfully completed.
            </p>
            <p className="text-gray-300 mb-4">
              Your tickets for <strong>{title}</strong> have been successfully purchased. Confirmation emails with ticket details and QR codes have been sent to the individual email addresses provided for each attendee. Please check your inbox (and spam/junk folder).
            </p>
            {transaction && (
              <div className="mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Transaction Details
                </h3>
                <p className="text-gray-300">Reference: {transaction.reference}</p>
                <p className="text-gray-300">Subtotal: {formatNaira(transaction.amount)}</p>
                <p className="text-gray-300">Fees: {formatNaira(transaction.fees)}</p>
                <p className="text-gray-300">Total: {formatNaira(transaction.total)}</p>
                <p className="text-gray-300">Payment Provider: {transaction.paymentProvider}</p>
                <p className="text-gray-300">Date: {new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
            )}
            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Your Tickets
            </h2>
            {Object.entries(ticketsByEmail).length > 0 ? (
              Object.entries(ticketsByEmail).map(([email, { buyerName, tickets }], index) => (
                <div key={index} className="mb-6 border border-white/20 p-4 rounded-lg">
                  <p className="text-white/90 font-semibold">
                    Attendee: {buyerName} ({email})
                  </p>
                  {tickets.map((ticket) => (
                    <div key={ticket._id} className="mt-4">
                      <p className="text-white/90">
                        Ticket: {ticket.type.toUpperCase()} (₦{ticket.price.toLocaleString('en-NG')})
                      </p>
                      <p className="text-gray-300 text-sm">Ticket ID: {ticket.ticketId}</p>
                      <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32 mt-2" />
                      <button
                        className="mt-2 rounded-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 transition"
                        onClick={() => handleDownloadQR(ticket.qrCode, ticket.ticketId)}
                      >
                        Download QR Code
                      </button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-red-400">No tickets found. Please contact support.</p>
            )}
            <button
              className="w-full mt-5 rounded-full px-6 py-3 font-medium text-white hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
              onClick={() => navigate('/explore')}
            >
              Back to Explore
            </button>
          </section>

          <aside className="lg:pl-6">
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Summary
            </h2>

            <div
              className="rounded-xl p-5 bg-white/5"
              style={{ border: '1px solid rgba(255, 0, 0, 0.4)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
              </div>

              <div className="mt-4 space-y-3">
                {items.length > 0 ? (
                  items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <span className="text-white/90">
                        {it.quantity}x {it.name.toUpperCase()}
                      </span>
                      <span className="text-white/90">
                        {formatNaira(it.price * it.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between text-gray-400">
                    <span>0x TICKETS</span>
                    <span>{formatNaira(0)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-300 pt-2">
                  <span>Fees</span>
                  <span>{formatNaira(fees)}</span>
                </div>

                <div className="flex items-center justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>

                <div className="h-px bg-white/10 my-2" />

                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Total</span>
                  <span>{formatNaira(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Success;