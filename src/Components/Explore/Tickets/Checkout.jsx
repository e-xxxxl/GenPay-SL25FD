// import React, { useMemo, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

// const Checkout = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const event = state?.event || null;
//   const itemsFromState = Array.isArray(state?.items) ? state.items : [];
//   const subtotal = typeof state?.subtotal === 'number' ? state.subtotal : 0;
//   const fees = typeof state?.fees === 'number' ? state.fees : 0;
//   const total = typeof state?.total === 'number' ? state.total : subtotal + fees;

//   const title = event?.eventName || event?.title || 'Event';
//   const sanitizedTitle = title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/-+/g, '-')
//     .trim();

//   const items = useMemo(
//     () =>
//       itemsFromState.map((it) => ({
//         id: it.id,
//         name: it.name || 'TICKET',
//         quantity: it.quantity || 0,
//         price: it.price || 0,
//       })),
//     [itemsFromState]
//   );

//   // Calculate total number of tickets
//   const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0);

//   // Initialize forms for each ticket
//   const [ticketForms, setTicketForms] = useState(
//     Array(totalTickets)
//       .fill()
//       .map(() => ({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         location: '',
//       }))
//   );

//   const [emailErrors, setEmailErrors] = useState(Array(totalTickets).fill(''));

//   const formatNaira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

//   const onChange = (index, e) => {
//     const { name, value } = e.target;
//     setTicketForms((prev) =>
//       prev.map((form, i) =>
//         i === index ? { ...form, [name]: value } : form
//       )
//     );

//     if (name === 'email') {
//       const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//       setEmailErrors((prev) =>
//         prev.map((err, i) =>
//           i === index ? (isValidEmail || !value ? '' : 'Please enter a valid email address') : err
//         )
//       );
//     }
//   };

//   const canProceed = ticketForms.every(
//     (form, index) =>
//       form.firstName.trim() &&
//       form.lastName.trim() &&
//       form.email.trim() &&
//       !emailErrors[index] &&
//       form.phone.trim() &&
//       form.location.trim()
//   ) && total > 0;

//   const handleProceed = () => {
//     if (!canProceed) return;

//     // Map ticket forms to tickets, associating each form with a ticket
//     const ticketAssignments = [];
//     let formIndex = 0;
//     items.forEach((item) => {
//       for (let i = 0; i < item.quantity; i++) {
//         ticketAssignments.push({
//           ticketId: item.id,
//           customer: ticketForms[formIndex],
//         });
//         formIndex++;
//       }
//     });

//     console.log('Checkout proceeding to payment:', {
//       event,
//       tickets: ticketAssignments,
//       items,
//       subtotal,
//       fees,
//       total,
//     });

//     navigate('/checkout/payment', {
//       state: {
//         event,
//         tickets: ticketAssignments,
//         items,
//         subtotal,
//         fees,
//         total,
//       },
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <header className="flex items-center gap-3 p-5">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
//           aria-label="Go back"
//         >
//           <ArrowLeft className="h-5 w-5 text-white" />
//         </button>
//         <div className="flex items-center gap-2 text-gray-300">
//           <span
//             className="inline-block h-2.5 w-2.5 rounded-full"
//             style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
//             aria-hidden
//           />
//           <span className="text-sm sm:text-base" style={{ fontFamily: '"Poppins", sans-serif' }}>
//             {'/explore/'}{sanitizedTitle}
//           </span>
//         </div>
//       </header>

//       <main className="mx-auto w-full max-w-5xl px-4 pb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           <section>
//             <h1
//               className="text-2xl sm:text-3xl font-semibold mb-6"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             >
//               Checkout
//             </h1>

//             <div className="space-y-8">
//               {ticketForms.map((form, index) => (
//                 <div key={index} className="border border-white/20 p-6 rounded-lg">
//                   <h2
//                     className="text-xl font-semibold mb-4"
//                     style={{ fontFamily: '"Poppins", sans-serif' }}
//                   >
//                     Ticket {index + 1} Attendee Information
//                   </h2>
//                   <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//                     <div>
//                       <label htmlFor={`firstName-${index}`} className="sr-only">
//                         First Name
//                       </label>
//                       <input
//                         id={`firstName-${index}`}
//                         name="firstName"
//                         type="text"
//                         placeholder="First Name"
//                         value={form.firstName}
//                         onChange={(e) => onChange(index, e)}
//                         className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor={`lastName-${index}`} className="sr-only">
//                         Last Name
//                       </label>
//                       <input
//                         id={`lastName-${index}`}
//                         name="lastName"
//                         type="text"
//                         placeholder="Last Name"
//                         value={form.lastName}
//                         onChange={(e) => onChange(index, e)}
//                         className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor={`email-${index}`} className="sr-only">
//                         Email Address
//                       </label>
//                       <input
//                         id={`email-${index}`}
//                         name="email"
//                         type="email"
//                         placeholder="Email Address"
//                         value={form.email}
//                         onChange={(e) => onChange(index, e)}
//                         className={`w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600 ${
//                           emailErrors[index] ? 'border-red-400' : ''
//                         }`}
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       />
//                       {emailErrors[index] && (
//                         <p className="text-red-400 text-sm mt-1">{emailErrors[index]}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label htmlFor={`phone-${index}`} className="sr-only">
//                         Phone Number
//                       </label>
//                       <input
//                         id={`phone-${index}`}
//                         name="phone"
//                         type="tel"
//                         placeholder="Phone Number"
//                         value={form.phone}
//                         onChange={(e) => onChange(index, e)}
//                         className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor={`location-${index}`} className="sr-only">
//                         Location
//                       </label>
//                       <input
//                         id={`location-${index}`}
//                         name="location"
//                         type="text"
//                         placeholder="Location"
//                         value={form.location}
//                         onChange={(e) => onChange(index, e)}
//                         className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
//                         style={{ fontFamily: '"Poppins", sans-serif' }}
//                       />
//                     </div>
//                   </form>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <aside className="lg:pl-6">
//             <h2
//               className="text-2xl sm:text-3xl font-semibold mb-6"
//               style={{ fontFamily: '"Poppins", sans-serif' }}
//             >
//               Summary
//             </h2>

//             <div
//               className="rounded-xl p-5 bg-white/5"
//               style={{ border: '1px solid rgba(255, 0, 0, 0.4)' }}
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold truncate">{title}</h3>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {items.length > 0 ? (
//                   items.map((it) => (
//                     <div key={it.id} className="flex items-center justify-between">
//                       <span className="text-white/90">
//                         {it.quantity}x {it.name.toUpperCase()}
//                       </span>
//                       <span className="text-white/90">
//                         {formatNaira(it.price * it.quantity)}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex items-center justify-between text-gray-400">
//                     <span>0x TICKETS</span>
//                     <span>{formatNaira(0)}</span>
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between text-gray-300 pt-2">
//                   <span>Fees</span>
//                   <span>{formatNaira(fees)}</span>
//                 </div>

//                 <div className="flex items-center justify-between text-gray-300">
//                   <span>Subtotal</span>
//                   <span>{formatNaira(subtotal)}</span>
//                 </div>

//                 <div className="h-px bg-white/10 my-2" />

//                 <div className="flex items-center justify-between font-semibold text-white">
//                   <span>Total</span>
//                   <span>{formatNaira(total)}</span>
//                 </div>
//               </div>

//               <button
//                 className="w-full mt-5 rounded-full px-6 py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-40"
//                 style={{ background: 'linear-gradient(135deg, #A228AF 0%, #FF0000 100%)' }}
//                 onClick={handleProceed}
//                 disabled={!canProceed}
//               >
//                 Proceed
//               </button>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Checkout;

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

  // Calculate total number of tickets
  const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0);

  // Initialize forms for each ticket
  const [ticketForms, setTicketForms] = useState(
    Array(totalTickets)
      .fill()
      .map(() => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
      }))
  );

  const [emailErrors, setEmailErrors] = useState(Array(totalTickets).fill(''));

  // Modified formatNaira to handle free events
  const formatNaira = (n) => {
    if (n === 0) return 'Free';
    return `₦${Number(n || 0).toLocaleString('en-NG')}`;
  };

  const onChange = (index, e) => {
    const { name, value } = e.target;
    setTicketForms((prev) =>
      prev.map((form, i) =>
        i === index ? { ...form, [name]: value } : form
      )
    );

    if (name === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailErrors((prev) =>
        prev.map((err, i) =>
          i === index ? (isValidEmail || !value ? '' : 'Please enter a valid email address') : err
        )
      );
    }
  };

  // Allow proceeding if all forms are valid and at least one ticket is selected
  const canProceed = totalTickets > 0 && ticketForms.every(
    (form, index) =>
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      !emailErrors[index] &&
      form.phone.trim() &&
      form.location.trim()
  );

  const handleProceed = () => {
    if (!canProceed) return;

    // Map ticket forms to tickets, associating each form with a ticket
    const ticketAssignments = [];
    let formIndex = 0;
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        ticketAssignments.push({
          ticketId: item.id,
          customer: ticketForms[formIndex],
        });
        formIndex++;
      }
    });

    console.log('Checkout proceeding to payment:', {
      event,
      tickets: ticketAssignments,
      items,
      subtotal,
      fees,
      total,
    });

    navigate('/checkout/payment', {
      state: {
        event,
        tickets: ticketAssignments,
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

            <div className="space-y-8">
              {totalTickets === 0 ? (
                <p
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  No tickets selected. Please go back and select at least one ticket.
                </p>
              ) : (
                ticketForms.map((form, index) => (
                  <div key={index} className="border border-white/20 p-6 rounded-lg">
                    <h2
                      className="text-xl font-semibold mb-4"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Ticket {index + 1} Attendee Information
                    </h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div>
                        <label htmlFor={`firstName-${index}`} className="sr-only">
                          First Name
                        </label>
                        <input
                          id={`firstName-${index}`}
                          name="firstName"
                          type="text"
                          placeholder="First Name"
                          value={form.firstName}
                          onChange={(e) => onChange(index, e)}
                          className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label htmlFor={`lastName-${index}`} className="sr-only">
                          Last Name
                        </label>
                        <input
                          id={`lastName-${index}`}
                          name="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={form.lastName}
                          onChange={(e) => onChange(index, e)}
                          className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label htmlFor={`email-${index}`} className="sr-only">
                          Email Address
                        </label>
                        <input
                          id={`email-${index}`}
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          value={form.email}
                          onChange={(e) => onChange(index, e)}
                          className={`w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600 ${
                            emailErrors[index] ? 'border-red-400' : ''
                          }`}
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                        {emailErrors[index] && (
                          <p className="text-red-400 text-sm mt-1">{emailErrors[index]}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`phone-${index}`} className="sr-only">
                          Phone Number
                        </label>
                        <input
                          id={`phone-${index}`}
                          name="phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={form.phone}
                          onChange={(e) => onChange(index, e)}
                          className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label htmlFor={`location-${index}`} className="sr-only">
                          Location
                        </label>
                        <input
                          id={`location-${index}`}
                          name="location"
                          type="text"
                          placeholder="Location"
                          value={form.location}
                          onChange={(e) => onChange(index, e)}
                          className="w-full rounded-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                    </form>
                  </div>
                ))
              )}
            </div>
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