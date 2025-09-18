import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Buyticket = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event || null;

  // Normalize event info
  const title = event?.eventName || event?.title || 'Event';
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Normalize tickets with ticketType and ticketDescription
  const normalizedTickets = useMemo(() => {
    if (Array.isArray(event?.tickets) && event.tickets.length > 0) {
      return event.tickets.map((t, idx) => ({
        id: t.id || `tier-${idx}`,
        name: t.name || 'Ticket',
        price: typeof t.price === 'number' ? t.price : (typeof t.groupPrice === 'number' ? t.groupPrice : 0),
        ticketType: t.ticketType || 'Individual', // Default to Individual if not specified
        ticketDescription: t.ticketDescription || (t.ticketType === 'Group' ? `Group ticket for ${t.groupSize || 'multiple'} people` : 'Includes charges'),
        groupSize: t.groupSize || null, // Include groupSize for group tickets
        quantity: typeof t.quantity === 'number' ? t.quantity : 0, // Available quantity
      }));
    }
    return [
      { id: 'regular', name: 'Regular', price: 20000, ticketType: 'Individual', ticketDescription: 'Includes charges', groupSize: null, quantity: 0 },
      { id: 'vip', name: 'VIP Ravers', price: 90000, ticketType: 'Individual', ticketDescription: 'For the premium experience', groupSize: null, quantity: 0 },
    ];
  }, [event]);

  // Quantity state
  const [qty, setQty] = useState(() =>
    normalizedTickets.reduce((acc, t) => {
      acc[t.id] = 0;
      return acc;
    }, {})
  );

  const inc = (id) => {
    setQty((q) => {
      const ticket = normalizedTickets.find((t) => t.id === id);
      const maxQuantity = ticket?.quantity || Infinity;
      const current = q[id] || 0;
      if (current >= maxQuantity || ticket.quantity === 0) return q;
      return { ...q, [id]: current + 1 };
    });
  };

  const dec = (id) =>
    setQty((q) => {
      const next = Math.max(0, (q[id] || 0) - 1);
      return { ...q, [id]: next };
    });

  // Calculate fees
  const calculateFees = (subtotal) => {
    if (subtotal >= 1 && subtotal <= 2499) {
      return Math.round(subtotal * 0.035);
    } else if (subtotal >= 2500 && subtotal <= 126666) {
      return Math.round(subtotal * 0.035 + 100);
    } else if (subtotal >= 126667 && subtotal <= 399999) {
      return 4000;
    } else if (subtotal >= 400000 && subtotal <= 599999) {
      return 5000;
    } else if (subtotal >= 600000 && subtotal <= 1999999) {
      return 6000;
    } else if (subtotal >= 2000000 && subtotal <= 4999999) {
      return 7500;
    } else if (subtotal >= 5000000 && subtotal <= 7999999) {
      return 10000;
    } else if (subtotal >= 8000000) {
      return 12000;
    }
    return 0;
  };

  // Calculations
  const items = normalizedTickets
    .map((t) => ({ ...t, quantity: qty[t.id] || 0 }))
    .filter((t) => t.quantity > 0);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const fees = calculateFees(subtotal);
  const total = subtotal + fees;

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

  const proceed = () => {
    navigate(`/checkout/${event._id}`, {
      state: {
        event,
        items,
        subtotal,
        fees,
        total,
      },
    });
  };

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
            style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
            aria-hidden
          />
          <span className="text-sm sm:text-base" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {'/explore/'}{sanitizedTitle}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h1
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Checkout
            </h1>

            <div className="space-y-6">
              {normalizedTickets.map((t) => (
                <div key={t.id} className="pb-5 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{t.name}</h3>
                      <div className="mt-1 text-pink-400 font-semibold">{formatNaira(t.price)}</div>
                      <p className="mt-1 text-gray-400 text-sm">
                        {t.ticketDescription} {t.ticketType === 'Group' && t.groupSize ? `(Group of ${t.groupSize} people)` : t.ticketType === 'Individual' ? '(Individual ticket)' : ''}
                      </p>
                      {t.quantity === 0 && (
                        <p className="mt-1 text-red-400 font-semibold">Sold Out</p>
                      )}
                      {t.quantity > 0 && (
                        <p className="mt-1 text-gray-400 text-sm">
                          {`${t.quantity} ticket${t.quantity > 1 ? 's' : ''} left`}
                        </p>
                      )}
                    </div>

                    {t.quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white/5 rounded-md overflow-hidden">
                          <button
                            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
                            onClick={() => dec(t.id)}
                            disabled={(qty[t.id] || 0) === 0}
                            aria-label={`Decrease ${t.name}`}
                          >
                            -
                          </button>
                          <span className="px-3 py-2 text-white/90 border-x border-white/10 min-w-[2ch] text-center">
                            {qty[t.id] || 0}
                          </span>
                          <button
                            className="px-3 py-2 text-white disabled:opacity-40"
                            onClick={() => inc(t.id)}
                            disabled={t.quantity === 0 || (qty[t.id] || 0) >= t.quantity}
                            aria-label={`Increase ${t.name}`}
                            style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-red-400 font-semibold">Sold Out</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:pl-6">
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Summary
            </h2>

            <div className="rounded-xl p-5 bg-white/5" style={{ border: '1px solid rgba(255, 0, 0, 0.4)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
              </div>

              <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex items-center justify-between text-gray-400">
                    <span>0x TICKETS</span>
                    <span>{formatNaira(0)}</span>
                  </div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <span className="text-white/90">
                        {it.quantity}x {it.name.toUpperCase()} {it.ticketType === 'Group' && it.groupSize ? `(Group of ${it.groupSize})` : it.ticketType === 'Individual' ? '(Individual)' : ''}
                      </span>
                      <span className="text-white/90">
                        {formatNaira(it.price * it.quantity)}
                      </span>
                    </div>
                  ))
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

              <button
                className="w-full mt-5 rounded-full px-6 py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
                onClick={proceed}
                disabled={total <= 0}
              >
                Proceed
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Buyticket;