import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP'; // Ensure this import exists
import Login from './pages/Login';
import ForgotPasswordEmail from './pages/ForgotPasswordEmail';
import ForgotPasswordVerifyOTP from './pages/ForgotPasswordVerifyOTP';
import ForgotPasswordReset from './pages/ForgotPasswordReset';
import { ToastContainer } from 'react-toastify';
import ChatPage from './pages/ChatPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password-email" element={<ForgotPasswordEmail />} />
        <Route path="/forgot-password-verify-otp" element={<ForgotPasswordVerifyOTP />} />
        <Route path="/forgot-password-reset" element={<ForgotPasswordReset />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
