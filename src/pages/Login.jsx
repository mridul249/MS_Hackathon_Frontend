import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const instance = axios.create({
        withCredentials: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        credentials: "include",
      });

      const response = await instance.post(
        "http://localhost:5001/api/v1/users/login",
        formData
      );

      console.log("Login response:", response.data);
      toast.success("Logged in successfully!");

      navigate(`/chat/${response.data.data.user.chatId}`, {
        state: {
          fullName: response.data.data.user.fullName,
          email: response.data.data.user.email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-[#1d8621] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1d8621]">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full bg-[#1d8621] hover:bg-green-700 text-white p-3 rounded font-semibold transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex justify-between text-[#1d8621]">
          <Link to="/" className="hover:underline">
            Sign Up
          </Link>
          <Link to="/forgot-password-email" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
