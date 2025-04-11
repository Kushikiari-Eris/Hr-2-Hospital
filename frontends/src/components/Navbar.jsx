import React from 'react'
import { Menu } from "lucide-react";
import useAuthStore from '../stores/useAuthStore';

const Navbar = ({ toggleSidebar }) => {
    const {user, loading} = useAuthStore();

  return (
    <>
    <div className="bg-teal-600 shadow-md p-4 flex items-center justify-between md:justify-end">
      <button onClick={toggleSidebar} className="md:hidden text-gray-900">
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-semibold hidden md:block">{user.name}</h1>
    </div>
    </>
  )
}

export default Navbar