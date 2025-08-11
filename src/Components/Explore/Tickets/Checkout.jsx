// Components/CheckoutPage.js
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event || null;
  const itemsFromState = Array.isArray(state?.items) ? state.items : [];
  const subtotal = typeof state?.subtotal === 'number' ? state.subtotal : 0;
  const fees = typeof state?.fees === 'number' ? state.fees : 0;
  const total = typeof state?.total === 'number' ? state.total : subtotal + fees;

  const title = event?.eventName || event?.title || 'Event';
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const items = useMemo(
    () =>
      itemsFromState.map((it) => ({
        id: it.id,
        name: it.name || 'TICKET',
        quantity: it.quantity || 0,
        price: it.price || 0,
      })),
    [itemsFromState]
  );

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [emailError, setEmailError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(isValidEmail || !value ? '' : 'Please enter a valid email address');
    }
  };

  const canProceed =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    !emailError &&
    form.phone.trim() &&
    form.location.trim() &&
    total > 0;

  const handleProceed = () => {
    if (!canProceed) return;
    console.log('Checkout proceeding to payment:', { event, customer: form, items, subtotal, fees, total });
    navigate('/checkout/payment', {
      state: {
        event,
        customer: form,
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

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={onChange}
                  className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={onChange}
                  className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={onChange}
                  className={`w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600 ${emailError ? 'border-red-400' : ''}`}
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />
                {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
              <div>
                <label htmlFor="location" className="sr-only">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={onChange}
                  className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                />
              </div>
            </form>
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

              <button
                className="w-full mt-5 rounded-full px-6 py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
                onClick={handleProceed}
                disabled={!canProceed}
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

export default Checkout;