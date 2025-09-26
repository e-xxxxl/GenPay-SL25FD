import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LandingPage from "./Components/Pages/LandingPage";


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from "./Components/Pages/SignUpPage";
import VerifyEmailPage from "./Components/Pages/VerifyEmailPage";
import VerifiedPage from "./Components/Pages/VerifiedPage";
import SignInPage from "./Components/Pages/SignInPage";
import ForgotPassPage from "./Components/Pages/ForgotPassPage";
import ResetPassPage from "./Components/Pages/ResetPassPage";
import HostDashPage from "./Components/Pages/HostDashPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ShopPage from "./Components/Pages/ShopPage";
import AccountPage from "./Components/Pages/AccountPage";
import EditInfoPage from "./Components/Pages/EditInfoPage";
import IssuesPage from "./Components/Pages/IssuesPage";
import CreateEventPage from "./Components/Pages/CreateEventPage";
import UploadEventHeaderPage from "./Components/Pages/UploadEventHeaderPage";
import UploadEventGalleryPage from "./Components/Pages/UploadEventGalleryPage";
import EventDetailsPage from "./Components/Pages/EventDetailsPage";
import AddTicketPage from "./Components/Pages/AddTicketPage";
import TicketListPage from "./Components/Pages/TicketListPage";
import EditTicketPage from "./Components/Pages/EditTicketPage";
import ExplorePage from "./Components/Pages/ExplorePage";
import ExploreEventDetailsPage from "./Components/Pages/ExploreEventDetailsPage";
import BuyTicketPage from "./Components/Pages/BuyTicketPage";
import CheckoutPage from "./Components/Pages/CheckoutPage";
import PaymentPage from "./Components/Pages/PaymentPage";
import Success from "./Components/Explore/Tickets/Success";
import Sales from "./Components/Host/Event/Sales";
import LegalDocumentation from "./Components/Explore/LegalDocumentation";
import RefundPolicy from "./Components/Explore/RefundPolicy";
import WalletPage from "./Components/Pages/WalletPage";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminRoute from "./Components/Admin/AdminRoute";
import AboutUs from "./Components/Explore/AboutUs";
import NotFound from "./Components/Explore/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verified-email/:token" element={<VerifiedPage />} />
        <Route path="/forgot-password" element={<ForgotPassPage />} />
        <Route path="/reset-password/:token" element={<ResetPassPage />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <HostDashPage /></ProtectedRoute>}/>
        <Route path="/shop" element={<ProtectedRoute><ShopPage/></ProtectedRoute>} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/account/edit" element={<EditInfoPage/>} />
        <Route path="/reportissue" element={<IssuesPage/>} />
        <Route path="/create-event" element={<CreateEventPage/>} />
        <Route path="/create-event/upload-event-image" element={<UploadEventHeaderPage/>} />
        <Route path="/create-event/upload-event-gallery" element={<UploadEventGalleryPage/>} />
         <Route path="/event-details/:id" element={<EventDetailsPage/>} />
        <Route path="/add-ticket/:id" element={<ProtectedRoute><AddTicketPage/></ProtectedRoute>} />
        <Route path="/ticket-list/:id" element={<ProtectedRoute><TicketListPage/></ProtectedRoute>} />
        <Route path="/sales/:id" element={<ProtectedRoute><Sales/></ProtectedRoute>} />
        <Route path="/edit-ticket/:id/:ticketId" element={<EditTicketPage />} />
         <Route path="/explore" element={<ExplorePage />} />
         <Route path="/explore/:eventName" element={<ExploreEventDetailsPage />} />
         
        <Route path="/buy-ticket/:eventId" element={<BuyTicketPage/>} />
        <Route path="/checkout/:eventId" element={<CheckoutPage/>} />
        <Route path="/checkout/payment" element={<PaymentPage/>} />
        <Route path="/checkout/success" element={<Success/>} />
        <Route path="/legal" element={<LegalDocumentation/>} />
        <Route path="/legal/refund-policy" element={<RefundPolicy/>} />
        <Route path="/wallet" element={<WalletPage/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="*" element={<NotFound/>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute >
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
