"use client"

import { Link } from "react-router-dom"
import Navbar from "../Navbar/Navbar"

const LegalDocumentation = () => {
  const gradientTextStyle = {
    background: "linear-gradient(135deg, #A228AF 0%, #FF0000 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }

  const headingStyle = {
    color: "#BD6666",
    fontFamily: '"Poppins", sans-serif',
  }

  return (
    <>
   <Navbar/>
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-8 lg:px-12">
         
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium mb-8" style={headingStyle}>
          Genpay Legal Documentation
        </h1>

        {/* Navigation Links */}
        <div className="mb-8 space-y-1">
          <a
            href="#terms"
            className="block hover:opacity-80 transition-opacity"
            style={{ ...gradientTextStyle, fontFamily: '"Poppins", sans-serif' }}
          >
            Terms of Use
          </a>
          <a
            href="#privacy"
            className="block hover:opacity-80 transition-opacity"
            style={{ ...gradientTextStyle, fontFamily: '"Poppins", sans-serif' }}
          >
            Privacy Policy
          </a>
          <Link
            to="refund-policy"
            className="block hover:opacity-80 transition-opacity"
            style={{ ...gradientTextStyle, fontFamily: '"Poppins", sans-serif' }}
          >
            Refund Policy
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Introduction */}
          <div className="space-y-4">
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              Please read these Terms of Use carefully, as they set out the terms under which you may access and use the
              Genpay website (the "Website") operated by Marvex Limited ("Genpay," "we," "us," or "our"). If you have
              any questions or do not agree with these terms, please contact us at{" "}
              <a
                href="mailto:support@genpay.ng"
                className="hover:opacity-80 transition-opacity"
                style={gradientTextStyle}
              >
                support@genpay.ng
              </a>{" "}
              before using the Website.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              We may update these Terms of Use from time to time, so we encourage you to check the Website at
              genpay.ng/terms regularly to stay informed of any changes. By continuing to use the Website after any
              updates are made, you confirm your acceptance of the revised Terms of Use.
            </p>
          </div>

          {/* Section 2.0 Who we are */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              2.0 Who we are
            </h2>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              Genpay is an all-in-one social commerce platform designed for the modern event-goer. Users can buy and
              sell tickets for events, as well as sell event-related items such as merchandise, accessories, gadgets,
              and more. Beyond transactions, Genpay fosters connection through its integrated social space, allowing
              users to chat, network, and make new friends around shared event experiences. Genpay Nigeria is a product
              belonging to Marvex Limited.
            </p>
          </div>

          {/* Section 2.0 Definitions */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              2.0 Definitions
            </h2>
            <div className="space-y-3">
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Platform:</span> Means the Genpay website or any other digital
                interface operated by Marvex Ltd through which Users can access the Services.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Ticket:</span> means the digital or physical proof of purchase
                granting the User access to a specific event listed on the Platform.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Event:</span> Means any public or private gathering, activity,
                or experience for which tickets are sold via the Platform.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Host:</span> Means any registered User who creates and manages
                events and sells tickets through the Platform; also referred to as an Event Organizer.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Guest:</span> Means any User who purchases a ticket to attend
                an Event via the Platform.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Transaction:</span> Means any financial activity or exchange
                completed via the Platform related to the purchase or sale of Tickets.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Payout:</span> Means the total funds remitted to a Host after
                deductions (including fees and charges) for ticket sales completed through the Platform.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Wallet:</span> Means the Host's internal balance or settlement
                space within the Platform (if applicable) where earnings are calculated before payout.
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-white font-medium">Commission:</span> Means the percentage or fixed amount
                deducted by GenPay for facilitating a ticket sale.
              </p>
            </div>
          </div>

          {/* Section 3.0 Purpose, Acceptance & Use */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              3.0 Purpose, Acceptance & Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  3.1 Purpose
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  These Terms of Use ("T&C"), along with any other agreements between you and Genpay (a product of
                  Marvex Limited), constitute a binding contract between you and Genpay. They set forth the terms under
                  which you are permitted to access and use the Platform. These T&C, including any amendments or
                  updates, shall take effect on the date of their publication on the Platform, or on such other date as
                  may be expressly communicated to you, whichever is earlier.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  3.2 Acceptance
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  This T&C governs your use of all products, services, content, and information provided by Genpay in
                  connection with the Platform. By downloading, registering, accessing, or using the Platform, you
                  acknowledge that you have read, understood, and agree to be legally bound by these Terms of Use. If
                  you do not agree with this T&C and/or our Privacy Policy, you must not access or use the Platform.
                </p>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You will be required to confirm your acceptance of this T&C by ticking the "AGREE" checkbox provided.
                  By doing so, you consent to the application of this T&C and our Privacy Policy, and acknowledge that
                  it will govern your access to and use of the Platform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  3.3 Acceptance
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2" style={headingStyle}>
                      3.3.1 Use of Genpay Platform
                    </h4>
                    <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Your use of the Platform is governed by the version of this T&C in effect on the date you access
                      or use the Platform. Genpay reserves the right to amend, modify, vary, or update these T&C at any
                      time, with or without prior notice. By continuing to access or use the Platform after any such
                      changes have been published, you will be deemed to have accepted the revised T&C.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={headingStyle}>
                      3.3.2
                    </h4>
                    <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                      You acknowledge and agree that Genpay provides access to the Platform exclusively through
                      electronic means. Any queries, issues, or complaints related to the use of the Platform must be
                      directed to Genpay via the designated customer support email at{" "}
                      <a
                        href="mailto:support@genpay.ng"
                        className="hover:opacity-80 transition-opacity"
                        style={gradientTextStyle}
                      >
                        support@genpay.ng
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4.0 Access to Genpay Platform */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              4.0 Access to Genpay Platform
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.1
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  We provide the Services electronically and allow Users to register for an account on the Genpay
                  Platform for the purpose of creating, managing, and selling tickets for events and related products.
                  You may register for a Host Profile only if you are the Event Organiser, or a duly authorized agent
                  acting on behalf of the Event Organiser, with written consent to sell tickets for the said event.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay provides the Services directly to the Event Organiser. There is no contractual relationship
                  between Genpay and the end customers or ticket buyers ("Event Attendees"). All tickets sold through
                  the Platform constitute a direct contractual relationship between the Event Organiser and the Event
                  Attendee. It is solely the responsibility of the Event Organiser to define and communicate the terms
                  of sale to their Event Attendees.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Accordingly, you (as the Event Organiser) agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Handle all customer support and communication with your Event Attendees directly, and not refer such
                    matters to Genpay;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Respond to all inquiries or complaints from Event Attendees within three (3) business days of
                    receipt;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Assume full liability and responsibility for any contractual claims, issues, or disputes arising
                    from your relationship with Event Attendees;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Promptly notify your Event Attendees, and update your Genpay event page, if your event is cancelled,
                    postponed, or materially altered from the information originally provided at the time of ticket
                    listing.
                  </li>
                </ul>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay reserves the right to suspend or terminate your access to the Platform and Services if you fail
                  to comply with your obligations under this clause or breach your duties toward Event Attendees.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  When using the Genpay Platform, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Comply with all applicable laws, regulations, and obligations relevant to your provision of events,
                    services, or goods, and the collection of booking or transaction fees;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Provide accurate and complete information and materials as may be reasonably requested by Genpay in
                    connection with the Services;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Promptly update any information or material on your Host Profile or event pages to ensure accuracy,
                    transparency, and regulatory compliance;
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Cooperate fully with Genpay in all matters related to the provision and operation of the Services.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.2
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  To create a User Profile on the Genpay Platform, you are required to provide certain personal or
                  business information, including your full name (or registered business or company name, if
                  applicable), phone number, and email address (collectively referred to as "Personal Information").
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You agree to provide true, accurate, current, and complete information during the registration
                  process. By registering, you hereby authorize Genpay to verify your Personal Information using any
                  available independent or third-party sources, as permitted by applicable law.
                </p>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You are responsible for ensuring that your Personal Information remains up to date. You agree to
                  promptly update any changes to your Personal Information through the appropriate settings within the
                  Platform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.3
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  To access and use the Genpay Platform, you must register and create a User Profile. During
                  registration, the email address you provide will serve as your username, and you will be required to
                  create a secure password, which will be used to log in to your User Profile.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay implements physical, electronic, and procedural safeguards consistent with regulatory standards
                  to protect users' non-public Personal Information. However, you are solely responsible for maintaining
                  the confidentiality of your login credentials and all activity conducted under your account.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  While Genpay will take all reasonable steps to safeguard your Personal Information, you acknowledge
                  and accept full responsibility for any breach, unauthorized access, loss, compromise, or misuse of
                  your Personal Information arising from your own actions, inaction, negligence, or carelessness.
                </p>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You agree to immediately notify Genpay via{" "}
                  <a
                    href="mailto:support@genpay.ng"
                    className="hover:opacity-80 transition-opacity"
                    style={gradientTextStyle}
                  >
                    support@genpay.ng
                  </a>{" "}
                  upon becoming aware of any disclosure, loss, theft, or unauthorized access or use of your login
                  credentials or Personal Information.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.4
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay reserves the right to request further information from you at any time in connection with your
                  use of the Platform. This may include, but is not limited to, information required for verification,
                  compliance, or operational purposes.
                </p>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Failure to provide the requested information within the timeframe specified by Genpay may result in
                  the restriction, suspension, or termination of your access to the Platform and its Services.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.5
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay reserves the right, at its sole discretion, to decline your application to access the Platform
                  or to revoke such access at any time, without obligation to assign any reason or provide prior notice,
                  except where otherwise required by applicable law.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.6
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Genpay offers its Services exclusively through electronic means via its official website and mobile
                  application. You acknowledge and agree that access to the Platform and related Services is available
                  solely online, and you are not entitled to request or receive such services at any physical office
                  location of Marvex Ltd, unless otherwise expressly communicated by us at our sole discretion.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  4.7
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Upon successful completion of the registration process, you will be deemed to have created and hold an
                  active User Profile on the Genpay Platform.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5.0 Prohibited Uses */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              5.0 Prohibited Uses
            </h2>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree that you will not engage in any conduct that is prohibited on the Platform.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  5.1.1
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Use the Platform in any way that could damage, disable, overburden, or impair Genpay's servers or any
                  network connected to them, or interfere with any other person's ability to use or access the Platform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  5.1.2
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Use the Platform for any illegal, unlawful, or malicious purpose, or engage in any activity considered
                  improper or prohibited under the laws of the Federal Republic of Nigeria, including but not limited to
                  money laundering, terrorism financing, fraud, or racketeering.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  5.1.3
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Impersonate any individual or entity, misrepresent your identity or affiliation with any person or
                  organization, or provide any false, misleading, or inaccurate information in connection with your use
                  of the Platform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  5.1.4
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Use the Platform to post, upload, or transmit any material or content without first obtaining all
                  necessary licenses, permissions, or approvals required for such use.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  5.1.5
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Use the Platform in any way that promotes or encourages conduct which may constitute a criminal
                  offense, give rise to civil liability, or otherwise violate any applicable law or regulation in
                  Nigeria or any other jurisdiction.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Access or attempt to access another user's profile without proper authorization, or solicit, collect,
                  or attempt to obtain another user's login credentials or personal access information.
                </p>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You agree that Genpay reserves the right to suspend your access to the Platform or terminate your
                  account at its sole discretion if there is reason to believe that you have engaged in any of the
                  prohibited activities described above. Genpay may also pursue civil or criminal action against you
                  where applicable. You acknowledge that Genpay shall not be liable for any loss, damage, or consequence
                  resulting from your misuse of the Platform or violation of these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6.0 Communication */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              6.0 Communication
            </h2>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You consent to receive all notifications, notices, updates, statements, communications, records, and any
              other information related to the Platform electronically ("Correspondence and Communication"). Where
              applicable, you agree to bear any charges, costs, or expenses associated with the delivery of such
              Correspondence and Communication to you.
            </p>
          </div>

          {/* Section 7.0 Transmission of Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              7.0 Transmission of Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  7.1
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Your use of the Platform may require the transmission of your Personal Information to third-party
                  service providers for the purpose of delivering our Services. By using the Platform, you expressly
                  consent to the transmission of such information and acknowledge that this consent shall remain valid
                  and effective with each use of the Platform. You further agree that Genpay reserves the right to
                  request additional information from you at any time in relation to your access to or use of the
                  Platform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  7.2
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  The transmission, processing, use, and/or analysis of your Personal Information shall be carried out
                  by Genpay in strict compliance with the provisions of the Nigeria Data Protection Regulation 2019
                  (NDPR) and any other applicable data protection laws or regulations in force.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8.0 Usage Monitoring */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              8.0 Usage Monitoring
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              We reserve the right to access, archive, and monitor your use of the Platform in accordance with the
              applicable laws of the Federal Republic of Nigeria. By using the Platform, you acknowledge and accept
              Genpay’s right to carry out such monitoring for purposes including, but not limited to, ensuring service
              quality, evaluating Platform performance and security, and verifying compliance with these Terms &
              Conditions.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree that such monitoring does not grant you any claim, right, or cause of action relating to how
              Genpay monitors or enforces (or chooses not to enforce) these Terms. Furthermore, you agree that Genpay
              shall not be liable for any loss or damages you may incur as a result of its monitoring practices.
            </p>
          </div>

          {/* Section 9.0 Copyright, Trademark, and Intellectual Property Rights */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              9.0 Copyright, Trademark, and other Intellectual Property Rights
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You acknowledge that the Genpay Platform and all its content—including but not limited to text, graphics,
              user interface elements, logos, and underlying software—are protected by applicable copyright, trademark,
              trade secret, patent, and other intellectual property laws, and that these rights remain valid across all
              current and future media or technologies.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree not to copy, reproduce, distribute, modify, or create derivative works from any part of the
              Platform without our explicit prior written consent. Use of any content from the Platform for commercial
              purposes is strictly prohibited unless you have obtained a valid license from Marvex Ltd (owners of
              Genpay).
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              Where such permission or license is granted, you must clearly acknowledge Genpay (or Marvex Ltd) as the
              rightful owner and author of the content.
            </p>
          </div>

          {/* Section 10.0 Connectivity */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              10.0 Connectivity
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree that you are solely responsible for the tools, devices, and connections you use to access the
              Genpay Platform, and you acknowledge that your hardware, software, internet connection,
              telecommunications provider, or other third-party systems may not always function as intended.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              Genpay shall not be held liable for any loss, damages, or disruption caused by viruses, malware, or other
              technologically harmful material that may affect your device, systems, or data as a result of accessing or
              using the Platform, or downloading any content from it.
            </p>
          </div>

          {/* Section 11.0 Indemnification */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              11.0 Indemnification
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You acknowledge and accept that the Genpay Platform is not a guaranteed secure medium for the
              transmission of information. You bear all risks associated with the loss, interception, or unauthorized
              access to any information transmitted through the Platform. Genpay shall not be liable for any such loss
              or breach.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Genpay shall not be held responsible for any damages, losses, or injuries arising from or related to your
              use or inability to use the Platform. This includes, but is not limited to, non-availability or
              performance failures, loss or corruption of data, damage to property or reputation (including loss of
              profit or goodwill), business interruption, errors or omissions, delays, or communication failures.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You further agree to indemnify and hold harmless Genpay, its directors, officers, employees, partners,
              successors, and assigns from and against any claims, liabilities, legal proceedings, losses, damages,
              costs, or expenses arising out of your use of the Platform or any breach of these Terms.
            </p>
          </div>

          {/* Section 12.0 Availability of the Platform and Services */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              12.0 Availability of the Platform and Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  12.1
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  While we have invested significant effort into the development and testing of the Genpay Platform, you
                  acknowledge that technical issues, slowdowns, or service interruptions may occasionally occur. We may
                  also need to restrict access to certain features or parts of the Platform from time to time to carry
                  out routine maintenance or emergency upgrades. We aim to schedule such maintenance during off-peak
                  hours, typically at night or over weekends, but do not guarantee uninterrupted access. You understand
                  and accept that continuous or error-free availability of the Platform cannot be assured.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  12.2
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  We are committed to continually enhancing the Genpay experience and may update, modify, suspend, or
                  discontinue any aspect of the Services offered on the Platform—temporarily or permanently—with or
                  without prior notice. You agree that Genpay shall not be liable to you or any third party for any such
                  changes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 13.0 Termination and Withdrawal */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              13.0 Termination and Withdrawal
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  13.1.1
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You acknowledge and agree that Genpay reserves the right to restrict, suspend, or terminate these
                  Terms & Conditions or your access to any part or all of the Platform at any time, with or without
                  cause, including but not limited to any breach of these Terms, and without prior notice.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  13.1.2
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  We will fully cooperate with law enforcement agencies and comply with any valid court orders that
                  require or direct us to disclose the identity of any user posting, publishing, or making available any
                  content or communications believed to be in violation of these Terms.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  13.1.3
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Any suspension, termination, or cancellation of your use of the Platform shall not affect any ongoing
                  obligations under these Terms & Conditions—including, but not limited to, clauses relating to
                  intellectual property, indemnity, and limitations of liability—which are intended to survive such
                  actions by their nature and context.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  13.2 Withdrawal
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You have a right to withdraw from the Platform at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Section 14.0 Representations and Warranties */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              14.0 Representations and Warranties
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              By accessing and using the Genpay Platform, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You have carefully read, understood, and agreed to be bound by these Terms & Conditions (T&C);
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You are at least 18 years of age, or you are using the Platform under the supervision of a legal
                guardian;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                All Personal Information and any other data provided by you to Genpay is true, accurate, current,
                complete, and authentic;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You grant Genpay the right to use your Personal Information in accordance with these T&C and our Privacy
                Policy;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You agree to comply fully with these T&C and acknowledge that they are without prejudice to any
                additional legal rights or remedies Genpay may have under the laws of the Federal Republic of Nigeria or
                any other applicable law;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You shall not assign or transfer any of your rights or obligations under these T&C to any third party
                without our prior written consent;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Your acceptance and use of the Platform does not violate any existing law, regulation, contract, or
                obligation binding on you;
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                If you are accepting these T&C on behalf of a business, company, or legal entity, you have the full
                legal authority, consent, or authorisation to bind such entity to these terms.
              </li>
            </ul>
          </div>

          {/* Section 15.0 Limitation of Liability */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              15.0 Limitation of Liability
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Genpay is not a party to any transactions, relationships, or disputes between Event Organizers and Event
              Attendees. We do not pre-screen attendees, and we are not responsible for any fraudulent activity,
              misrepresentation, or misconduct by users of the Platform. You acknowledge and accept that any dispute or
              issue arising in connection with an event lies solely between you and the relevant party.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              We expressly disclaim any and all liability for any actions we may take in response to violations of these
              Terms or misuse of our Services. Your sole and exclusive remedy for dissatisfaction with the Platform or
              the Services is to discontinue use of the Platform.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              To the fullest extent permitted by law, Marvex Ltd (owners of Genpay) shall not be liable for any form of
              damages—whether direct, indirect, incidental, special, punitive, consequential, or exemplary—arising from
              or in connection with your access to or use of the Platform, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Loss of profits, sales, business, savings, revenue, goodwill, or data
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Delays, interruptions, or failures in system performance
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Equipment or network failures (including internet or telecommunication disruptions)
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Acts of God (e.g., flood, fire, earthquake) or civil unrest
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>Government actions, war, or terrorism</li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Unauthorized access, theft, destruction, or alteration of data or information
              </li>
            </ul>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree that these limitations apply regardless of the cause of action or legal theory, even if Genpay
              has been advised of the possibility of such damages.
            </p>
          </div>

          {/* Section 16.0 Disclaimer of Warranties */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              16.0 Disclaimer of Warranties
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You acknowledge and agree that the Genpay Platform is provided on an “as is” and “as available” basis,
              without any warranties or guarantees of any kind—express or implied.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Neither Marvex Ltd, nor any of its directors, officers, employees, or agents, make any representations or
              warranties regarding the accuracy, reliability, completeness, or usefulness of any content or information
              made available on the Platform.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              We do not guarantee that the Platform will meet your specific requirements or expectations, nor do we
              warrant that your experience will be uninterrupted, secure, timely, or error-free.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              You accept full responsibility for any loss, damage, or inconvenience that may result from your use of or
              reliance on the Platform, and you use the Platform at your own risk.
            </p>
          </div>

          {/* Section 17.0 Third Party Service Provider(s) */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              17.0 Third Party Service Provider(s)
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              To ensure seamless access to and use of the Genpay Platform, we may integrate or rely on services provided
              by third-party service providers. You acknowledge and agree that Genpay (operated by Marvex Ltd) bears no
              responsibility or liability for the quality, performance, availability, privacy policies, or practices of
              any third-party service provider.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Please do not accept these Terms of Use if you do not agree with the terms and conditions of any
              third-party provider integrated into the Platform.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              We commit to informing you promptly of any changes, amendments, or variations to the Terms of Use of such
              third-party providers that may affect your use of the Platform.
            </p>
          </div>

          {/* Section 18.0 Third Party Service Provider(s) Disclaimer */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              18.0 Third Party Service Provider(s) Disclaimer
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You acknowledge and agree that these Terms & Conditions govern only the use of the Genpay Platform and do
              not extend to services offered by third-party providers that may be integrated into the Platform.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Our decision to engage or integrate third-party services does not constitute an endorsement of the
              content, policies, or operations of such service providers. By accessing and using the Platform, you
              expressly agree to interact with any third-party service at your own risk.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You also agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                Genpay (Marvex Ltd) does not control third-party providers, and no agency, partnership, or joint venture
                relationship exists between us and them.
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                We expressly disclaim any liability or responsibility for the performance, reliability, accuracy,
                security, or availability of any third-party service.
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                We do not guarantee that services provided by such third parties will be error-free, uninterrupted, or
                secure, nor do we guarantee their accuracy or completeness.
              </li>
              <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                You accept full responsibility for any loss, damage, or inconvenience that may result from your use of
                third-party services.
              </li>
            </ul>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              Any dispute, claim, or issue arising from or related to a third-party service must be addressed directly
              with the third-party provider and resolved under their own terms of use.
            </p>
          </div>

          {/* Section 19.0 Governing Law and Dispute Resolution */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              19.0 Governing Law and Dispute Resolution
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  19.1
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  These Terms & Conditions shall be governed by and construed in accordance with the laws of the Federal
                  Republic of Nigeria.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  19.2
                </h3>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  You agree that any claim, controversy, complaint, or dispute arising out of or related to your use of
                  the Genpay Platform ("Dispute") shall first be addressed through mutual consultation between you and
                  Genpay (operated by Marvex Ltd). If both parties are unable to resolve the Dispute within thirty (30)
                  days of initiating resolution efforts, the matter shall be referred to arbitration under the
                  Arbitration and Mediation Act, 2023.
                </p>
                <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  The arbitration process shall proceed as follows:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    A sole arbitrator shall be appointed jointly by both parties.
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    If the parties fail to agree on an arbitrator within fourteen (14) days of a written request for
                    arbitration, either party may apply to the Chairman of the Chartered Institute of Arbitrators, UK
                    (Nigeria Branch) to appoint an arbitrator.
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    The seat of arbitration shall be Lagos State, Nigeria, and the language of proceedings shall be
                    English.
                  </li>
                  <li style={{ fontFamily: '"Poppins", sans-serif' }}>
                    The arbitral award shall be final and binding, and judgment upon the award may be enforced in any
                    court with appropriate jurisdiction.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={headingStyle}>
                  19.3
                </h3>
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Notwithstanding the foregoing, Genpay reserves the exclusive right to institute legal proceedings
                  regarding any Dispute in a Nigerian court of competent jurisdiction, at its sole discretion.
                </p>
              </div>
            </div>
          </div>

          {/* Section 20.0 Severability and Miscellaneous Provisions */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium" style={headingStyle}>
              20.0 Severability and Miscellaneous Provisions
            </h2>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              If any provision of these Terms & Conditions is held to be unlawful, void, or for any reason
              unenforceable under applicable law, then that provision shall be deemed severable and shall not affect the
              validity and enforceability of the remaining provisions, which shall continue in full force and effect.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              The failure of Genpay (operated by Marvex Ltd) to enforce any right or provision under these Terms &
              Conditions shall not constitute a waiver of such right or provision, nor shall it limit Genpay’s ability
              to enforce that right or provision at a later time.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              You agree to comply with all applicable laws, regulations, and rules issued by any governmental or
              regulatory authority in connection with your access to or use of the Platform.
            </p>
            <p className="mb-4" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Genpay may assign or transfer any of its rights or obligations under these Terms & Conditions without your
              prior consent. You may not assign your rights or obligations without prior written approval from Genpay.
            </p>
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              The relationship between you and Genpay is that of independent parties. Nothing in these Terms &
              Conditions shall be construed to create a partnership, joint venture, agency, or employment relationship
              between you and Genpay.
            </p>
          </div>

          {/* Contact Information */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p style={{ fontFamily: '"Poppins", sans-serif' }}>
              For questions or support, contact us at{" "}
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
    </>
  )
}

export default LegalDocumentation