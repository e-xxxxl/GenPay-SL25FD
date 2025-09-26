import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event ?? null;
  const tickets = Array.isArray(state?.tickets) ? state.tickets : [];
  const items = Array.isArray(state?.items) ? state.items : [];
  const subtotal = typeof state?.subtotal === 'number' ? state.subtotal : 0;
  const fees = typeof state?.fees === 'number' ? state.fees : 0;
  const total = typeof state?.total === 'number' ? state.total : subtotal + fees;

  const title = event?.eventName || event?.title || 'Event';
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const [paystackChecked, setPaystackChecked] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const primaryCustomer = tickets.length > 0 ? tickets[0].customer : {};

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: primaryCustomer.email || 'default@example.com',
    amount: total * 100,
    publicKey,
    metadata: {
      custom_fields: [
        {
          display_name: 'Full Name',
          variable_name: 'full_name',
          value: `${primaryCustomer.firstName || 'Customer'} ${primaryCustomer.lastName || ''}`,
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: primaryCustomer.phone || 'N/A',
        },
        {
          display_name: 'Event',
          variable_name: 'event_name',
          value: title,
        },
      ],
    },
  };

  console.log('Payment component state:', {
    event,
    tickets,
    items,
    subtotal,
    fees,
    total,
    paystackChecked,
    publicKey,
  });

  const handlePaystackSuccess = async (response) => {
    try {
      setIsProcessing(true);
      console.log('Paystack success response:', response);
      const reference = response.reference || response.trxref;
      const apiResponse = await fetch(`https://genpay-sl25bd-1.onrender.com/api/events/${event._id}/purchase-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          tickets: tickets.map((t) => ({
            ticketId: t.ticketId,
            quantity: 1,
            customer: {
              firstName: t.customer.firstName,
              lastName: t.customer.lastName,
              email: t.customer.email,
              phone: t.customer.phone,
              location: t.customer.location,
            },
          })),
          reference,
          fees, // Include fees in the request
        }),
      });

      const data = await apiResponse.json();
      console.log('Purchase ticket API response:', data);

      if (data.status === 'success') {
        navigate('/checkout/success', {
          state: {
            event,
            tickets: data.data.tickets,
            items,
            subtotal,
            fees,
            total,
            provider: 'paystack',
            reference,
            transaction: data.data.transaction, // Pass transaction data
          },
        });
      } else {
        console.error('Ticket purchase failed:', data.message);
        alert('Failed to purchase tickets: ' + data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      alert('An error occurred while processing your purchase.');
      setIsProcessing(false);
    }
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
    alert('Payment was not completed. Please try again.');
    setIsProcessing(false);
  };

  if (!event || !tickets.length || tickets.some((t) => !t.customer.email) || !items.length || total <= 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">
          Invalid payment data. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-3 p-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Go back"
          disabled={isProcessing}
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
          <section className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
            <h1
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Payment
            </h1>

            {isProcessing && (
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
                <p className="text-gray-300">Processing your purchase, please wait...</p>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="provider"
                className="mt-1.5 accent-pink-600"
                checked={paystackChecked}
                onChange={() => setPaystackChecked(true)}
                disabled={isProcessing}
              />
              <span className="text-white/90">
                I want to make payment with{' '}
                <a
                  href="https://paystack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
                >
                  Paystack
                </a>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none mt-4">
              <input
                type="checkbox"
                className="mt-1.5 accent-pink-600"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                disabled={isProcessing}
              />
              <span className="text-white/90" style={{ fontFamily: '"Poppins", sans-serif' }}>
                I agree to the{' '}
                <Link
                  to="/legal"
                  className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to="/legal/refund-policy"
                  className="text-pink-400 hover:text-pink-300 underline underline-offset-2"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Refund Policy
                </Link>
              </span>
            </label>

            <div className="mt-8 flex items-start gap-3">
              <div
                className="h-9 w-9 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
              >
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                We guarantee safe and secure transactions when you pay with Paystack.
              </p>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div
                className="h-9 w-9 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
              >
                <span className="text-white font-semibold">!</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                The payment will be processed using the email <strong>{primaryCustomer.email || 'N/A'}</strong>. Tickets will be sent to the individual email addresses provided for each attendee.
              </p>
            </div>

            {(!paystackChecked || total <= 0 || !publicKey || !termsAgreed) && !isProcessing && (
              <p className="text-red-400 mt-4">
                {total <= 0
                  ? 'Please select at least one ticket to proceed.'
                  : !publicKey
                  ? 'Payment configuration error. Please try again later.'
                  : !paystackChecked
                  ? 'Please select Paystack to proceed.'
                  : 'Please agree to the Terms and Conditions and Refund Policy to proceed.'}
              </p>
            )}

            <PaystackButton
              {...paystackConfig}
              text={isProcessing ? 'Processing...' : `Pay ${formatNaira(total)}`}
              className="w-full mt-5 rounded-full px-6 py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-40"
              style={{
                background: 'linear-gradient(90deg, #A228AF 0%, #FF0000 100%)',
                fontFamily: '"Poppins", sans-serif',
                borderRadius: '10px 10px 10px 0px',
              }}
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              disabled={!paystackChecked || total <= 0 || !publicKey || !termsAgreed || isProcessing}
            />
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

export default Payment;