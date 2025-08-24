"use client"

const RefundPolicy = () => {
  const gradientTextStyle = {
    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium mb-8" style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666" }}>
          Refund Policy
        </h1>

        {/* Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={{ fontFamily: '"Poppins", sans-serif', color: "#BD6666" }}>
              Introduction
            </h2>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              This Refund Policy (the "Policy") informs you (the "Event Attendee") about your right to receive a refund
              for tickets purchased on the genpay.ng ("Genpay") platform via our website or mobile application ("the
              Platform").
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              By accepting this Policy, you agree that you have read this Policy carefully to understand your rights as
              set out below.
            </p>
          </div>

          {/* Policy Terms */}
          <div className="space-y-6">
            <p className="text-white font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree as follows:
            </p>

            <div className="space-y-6">
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                that Genpay is a self-service Platform that lets event creators ("Event Organizers") sell tickets
                directly to their intended audience;
              </p>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                that Genpay only uses the Platform to allow Event Organizers sell tickets to Event Attendees and is not
                directly involved in the organization or quality of these events. Event Organizers are responsible for
                their own terms of sale and for any enquiries that you may have. We are, therefore, not responsible for
                any loss or damage which occurs as a result of the cancellation of an event or mishap experienced at any
                event paid for via our Platform;
              </p>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                that Genpay reserves the right to charge a one-time non-refundable processing fee ("Genpay Fee") for
                every ticket purchased via the Platform;
              </p>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                in the event that you are dissatisfied with the cancellation or quality of an event, Genpay will not be
                liable for any damages, whether direct, indirect, incidental, consequential, special, punitive or
                exemplary, arising out of or in any way connected with your experience at an event paid for via our
                Platform;
              </p>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                in the event that you are dissatisfied with the cancellation or quality of an event and you request a
                refund from the Event Organisers, you are only entitled to a full refund of the ticket from the Event
                Organisers. Genpay Fee shall not form part of the refund granted to you;
              </p>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="font-bold text-white text-center" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  GENPAY WILL NOT REFUND THE COST OF TICKETS PURCHASED VIA THE PLATFORM IN THE EVENT THAT YOU ARE
                  DISSATISFIED WITH THE QUALITY OF AN EVENT.
                </p>
              </div>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                if after payment has been made through our Platform, the event gets cancelled or you are unable to
                attend an event for any reason, including but not limited to: severe or extraordinary weather (including
                flood, earthquake, or other act of god); fire, war, pandemic, epidemic, insurrection, terrorist act,
                riot, accident, emergency or action of government. Genpay will only assist with facilitating a refund
                from the Event Organisers and shall not be held liable for such refund.
              </p>

              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                If you experience any of the circumstances mentioned above, you agree to reach out directly to the Event
                Organiser to discuss your ticket refund.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              For questions or support regarding refunds, contact us at{" "}
              <a
                href="mailto:support@genpay.ng"
                className="hover:opacity-80 transition-opacity"
                style={gradientTextStyle}
              >
                support@genpay.ng
              </a>
            </p>
            <p className="mt-4 text-gray-500 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              © 2024 Genpay - A product of Marvex Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy
