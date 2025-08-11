// Components/Explore/Tickets/Success.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event ?? null;
  const customer = state?.customer ?? {};
  const items = Array.isArray(state?.items) ? state.items : [];
  const subtotal = state?.subtotal || 0;
  const fees = state?.fees || 0;
  const total = state?.total || 0;
  const reference = state?.reference || 'N/A';
  const tickets = Array.isArray(state?.tickets) ? state.tickets : [];

  const title = event?.eventName || event?.title || 'Event';
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

  const handleDownloadQR = (qrCode, ticketId) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `ticket_${ticketId}.png`;
    link.click();
  };

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
              Thank you, {customer.firstName} {customer.lastName}, for your purchase!
            </p>
            <p className="text-gray-300 mb-4">Transaction Reference: {reference}</p>
            <p className="text-gray-300 mb-4">
              Your tickets for {title} have been successfully purchased. Check your email ({customer.email}) for
              confirmation and ticket details.
            </p>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Your Tickets
            </h2>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket._id} className="mb-4">
                  <p className="text-white/90">
                    Ticket: {ticket.type.toUpperCase()} (₦{ticket.price.toLocaleString('en-NG')})
                  </p>
                  <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32 mt-2" />
                  <button
                    className="mt-2 rounded-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 transition"
                    onClick={() => handleDownloadQR(ticket.qrCode, ticket._id)}
                  >
                    Download QR Code
                  </button>
                </div>
              ))
            ) : (
              <p className="text-red-400">No tickets found.</p>
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