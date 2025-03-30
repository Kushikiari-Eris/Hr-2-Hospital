import React, { useState } from 'react'
import useAuthStore from '../stores/useAuthStore'
import { Link } from 'react-router-dom'
import { LogIn,  Loader } from 'lucide-react'
import logo from '../assets/image/logologo.png'
import bg from '../assets/image/background.jpg'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {login, loading} = useAuthStore()

    const handleSubmit = (e) =>{
        e.preventDefault()
        login(email, password)  
    }
  return (
    <>
        <div className="flex h-screen">
          {/* Left Side (Background with Logo) */}
          <div className="w-1/2 flex items-center justify-center relative">
            {/* Background Image with Lower Brightness */}
            <img src={bg} alt="Background" className="absolute inset-0 w-full h-full object-cover brightness-50" />
        
            {/* Transparent & Smaller Logo */}
            <img  
                src={logo}
                alt="Logo"
                className="w-80 h-auto z-20 brightness-150"
              />
        
              <h1 className='text-4xl font-body z-20 text-white'>Welcome to Nodado General Hospital</h1>
          </div>
        
          {/* Right Side (Login Form) */}
          <div className="w-1/2 flex items-center justify-center">
            <div className="p-8 w-3/4 bg-white shadow-lg border rounded-lg">
              <h2 className="text-3xl font-bold text-center">Login</h2>
        
              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input border rounded-lg p-3 w-full"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
        
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input border rounded-lg p-3 w-full"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
        
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{" "} 
                    <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                        Sign up now 
                    </Link>
                </p>
        
                 <div className="form-control mt-6">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                          Login 
                        </>
                      )}
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
        
    </> 
  )
}

export default LoginPage    