import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'; 
import Navbar from '../../components/Navbar';


const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <h2 className="text-2xl font-bold">Main Content</h2>
          <p className="mt-2 text-gray-600">This is the main content area.</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard