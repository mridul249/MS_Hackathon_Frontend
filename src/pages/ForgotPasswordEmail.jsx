import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPasswordEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with your backend endpoint to send OTP for password reset.
      await axios.post('http://your-backend-url.com/forgot-password/send-otp', { email });
      toast.success("OTP sent to your email!");
      // Navigate to the OTP verification page with email passed along.
      navigate('/forgot-password-verify-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-[#1d8621] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1d8621]">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#1d8621] mb-1">Enter your Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Your email address"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#1d8621] hover:bg-green-700 text-white p-3 rounded font-semibold transition duration-200"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        <div className="mt-6 text-center text-[#1d8621]">
          <Link to="/login" className="underline hover:text-green-400">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordEmail;
