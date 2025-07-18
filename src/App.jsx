import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LandingPage from "./Components/Pages/LandingPage";

import { Route, Routes } from "react-router-dom";
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
      </Routes>
    </>
  );
}

export default App;
