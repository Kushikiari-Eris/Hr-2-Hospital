import React, { useState } from 'react'
import useAuthStore from '../stores/useAuthStore'
import { Link } from 'react-router-dom'
import { UserPlus, Loader } from 'lucide-react'
import logo from '../assets/image/logologo.png'
import bg from '../assets/image/background.jpg'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
  })

  const { signup, loading } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(formData)
  }

  return (
    <div className="flex h-screen">
      {/* Left Side (Background with Logo) */}
      <div className="w-1/2 flex items-center justify-center relative">
        <img src={bg} alt="Background" className="absolute inset-0 w-full h-full object-cover brightness-50" />
        <img src={logo} alt="Logo" className="w-80 h-auto z-20 brightness-150" />
        <h1 className='text-4xl font-body z-20 text-white'>Welcome to Nodado General Hospital</h1>
      </div>

      {/* Right Side (Signup Form) */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="p-8 w-3/4 bg-white shadow-lg border rounded-lg">
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>

          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input border rounded-lg p-3 w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input border rounded-lg p-3 w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Department */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <input
                type="text"
                placeholder="Enter your department"
                className="input border rounded-lg p-3 w-full"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            {/* Position */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                placeholder="Enter your position"
                className="input border rounded-lg p-3 w-full"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input border rounded-lg p-3 w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input border rounded-lg p-3 w-full"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <p className="text-center text-sm text-gray-400 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Log in here
              </Link>
            </p>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Signing Up...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign Up
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
