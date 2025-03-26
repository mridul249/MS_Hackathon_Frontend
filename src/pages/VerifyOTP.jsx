import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const signupData = location.state;
  const otpLength = 5;
  const [otpDigits, setOtpDigits] = useState(Array(otpLength).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    // Allow only digits
    if (/^\d*$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value.slice(-1); // Only take the last digit
      setOtpDigits(newOtpDigits);
      // Move focus to next input if digit entered and not last input
      if (value && index < otpLength - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== otpLength) {
      toast.error("Please enter a complete OTP.");
      return;
    }
    try {
      setLoading(true);
      const requestData = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        otp,
      };
      console.log('Sending OTP verification data:', requestData);
      // Replace with your backend OTP verification endpoint.
      await axios.post('https://ms-hackathon-backend-js.onrender.com/api/v1/users/verify-otp', requestData);
      toast.success("OTP verified successfully!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-[#1d8621] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1d8621]">Verify OTP</h2>
        <p className="mb-4 text-center text-green-300">
          An OTP has been sent to {signupData?.email}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-3 mb-6">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={el => inputRefs.current[index] = el}
                className="w-12 h-12 text-center text-2xl rounded bg-gray-700 text-green-200 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              />
            ))}
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#1d8621] hover:bg-green-700 text-white p-3 rounded font-semibold transition duration-200"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
