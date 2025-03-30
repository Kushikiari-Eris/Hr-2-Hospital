import React, { useEffect } from 'react';
import './index.css';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import useAuthStore from './stores/useAuthStore';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore();
  const location = useLocation(); // Get current route

  useEffect(() => {
    checkAuth();
  }, []);

  const isAdmin = user?.role === "admin";

  if (checkingAuth) {
    return <div>Loading...</div>; // Optional: Show a loading state while checking auth
  }

  return (
     <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={isAdmin ? "/dashboard" : "/"} />} />
      </Routes>

      <Toaster /> 
    </div>
  );
}

export default App;
