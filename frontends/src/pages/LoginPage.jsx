import React, { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import { LogIn, Loader } from 'lucide-react';
import logo from '../assets/image/logologo.png';
import bg from '../assets/image/background.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Logo & Background */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto flex items-center justify-center">
        <img src={bg} alt="Background" className="absolute inset-0 w-full h-full object-cover brightness-50" />
        <div className="z-20 text-center px-4">
          <img src={logo} alt="Logo" className="w-40 mx-auto mb-4 brightness-150" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
            Welcome to Nodado General Hospital
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="p-6 sm:p-10 w-full max-w-md border rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p className="text-sm text-center text-gray-500 mb-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                Sign up now
              </Link>
            </p>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 rounded-md bg-orange-500 hover:bg-orange-400 text-white font-medium transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
