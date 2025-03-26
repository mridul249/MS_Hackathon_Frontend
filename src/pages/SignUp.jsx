import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    retypePassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await axios.post('https://ms-hackathon-backend-js.onrender.com/api/v1/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/verify-otp', { 
        state: { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-[#1d8621] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1d8621]">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[#1d8621] mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Enter your name" 
            />
          </div>
          <div className="mb-5">
            <label className="block text-[#1d8621] mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Enter your email" 
            />
          </div>
          <div className="mb-5">
            <label className="block text-[#1d8621] mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Enter your password" 
            />
          </div>
          <div className="mb-8">
            <label className="block text-[#1d8621] mb-1">Retype Password</label>
            <input 
              type="password" 
              name="retypePassword" 
              value={formData.retypePassword} 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-[#1d8621] transition"
              placeholder="Retype your password" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#1d8621] hover:bg-green-700 text-white p-3 rounded font-semibold transition duration-200"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center text-[#1d8621]">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-green-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
