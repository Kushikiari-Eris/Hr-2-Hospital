import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar'; 
import Navbar from '../../components/Navbar';
import TrainingAssignmentForm from '../../components/AdminComponents/TrainingAssignmentForm';

const TrainingAssignmentFormPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
    setIsOpen(!isOpen);
    };
  return (
    <>
    <div className="flex h-screen">
      {/* Sidebar (Fixed) */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} className="fixed left-0 top-0 h-full" />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen"> 
        {/* Navbar (Fixed at the Top) */}
        <Navbar toggleSidebar={toggleSidebar} className="fixed top-0 w-full" />

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-auto p-6">
            <TrainingAssignmentForm/>
        </div>
      </div>
    </div>
    </>
  )
}

export default TrainingAssignmentFormPage