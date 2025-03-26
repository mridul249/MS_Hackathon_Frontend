import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPasswordReset() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      // Replace with your backend endpoint to reset the password.
      await axios.post('http://your-backend-url.com/forgot-password/reset', {
        email,
        otp,
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-[#1d8621] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1d8621]">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[#1d8621] mb-1">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-8">
            <label className="block text-[#1d8621] mb-1">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Retype new password"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#1d8621] hover:bg-green-700 text-white p-3 rounded font-semibold transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-6 text-center text-[#1d8621]">
          <Link to="/login" className="underline hover:text-green-400">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordReset;
