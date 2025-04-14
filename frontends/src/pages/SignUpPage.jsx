import React, { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import { UserPlus, Loader } from 'lucide-react';
import logo from '../assets/image/logologo.png';
import bg from '../assets/image/background.jpg';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: '',
  });

  const { signup, loading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Logo & Background */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto flex items-center justify-center">
        <img
          src={bg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="z-20 text-center px-4">
          <img src={logo} alt="Logo" className="w-40 mx-auto mb-4 brightness-150" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
            Welcome to Nodado General Hospital
          </h1>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="p-6 sm:p-10 w-full max-w-lg border rounded-lg shadow-md ">
          <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Department</label>
              <input
                type="text"
                placeholder="Enter your department"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            {/* Position */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Position</label>
              <input
                type="text"
                placeholder="Enter your position"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Redirect to Login */}
            <p className="text-sm text-center text-gray-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline font-medium">
                Log in here
              </Link>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full flex justify-center items-center py-2 px-4 rounded-md bg-orange-500 hover:bg-orange-400 text-white font-medium transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Signing Up...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
