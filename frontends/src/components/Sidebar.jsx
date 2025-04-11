import { X, Home, User, Settings, BookOpen, ClipboardList, UserCircle } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const Sidebar = ({ isOpen, toggleSidebar }) => { 
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "superAdmin";
  
  return (
    <div
      className={`fixed top-0 left-0 h-screen border-r z-50 bg-teal-600 text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-yellow-500">HR <span className="text-white">HOSPITAL</span></h2>
        <button onClick={toggleSidebar} className="md:hidden">
          <X size={24} />
        </button>
      </div>

      {user && (
        <nav className="z-50">
          <h2 className="bg-teal-500 text-gray-900 font-bold w-full p-2 mt-5">MENU</h2>
          <div className="py-3">
            <a href="/dashboard" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
              <Home size={20} /> Dashboard
            </a>
            
            {/* Regular user menu items */}
            {!isSuperAdmin && (
              <>
                <a href="/course-list" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <BookOpen size={20} /> Courses
                </a>
                <a href="/tasks" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <ClipboardList size={20} /> Tasks
                </a>
                <a href="/profile" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <UserCircle size={20} /> Profile
                </a>
              </>
            )}
            
            {/* Admin-specific menu items */}
            {isSuperAdmin && (
              <>
                <h2 className="bg-teal-500 text-gray-900 font-bold w-full p-2 mt-4">LEARNING MANAGEMENT</h2>
                <div className="py-3">
                  <a href="/all-courses" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <BookOpen size={20} /> All Courses
                  </a>
                  <a href="/admin-settings" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <Settings size={20} /> Settings
                  </a>
                </div>
                <h2 className="bg-teal-500 text-gray-900 font-bold w-full p-2 mt-4">TRAINING MANAGEMENT</h2>
                <div className="py-3">
                  <a href="/trainingCourse-list" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <BookOpen size={20} /> Training Courses
                  </a>
                  <a href="/trainingAssignment-list" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <Settings size={20} /> Training Assignment
                  </a>
                  <a href="/trainingComplianceReport" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <Settings size={20} /> Compliance Reports
                  </a>
                  <a href="/trainingGapsReport" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <Settings size={20} /> Training Gap Reports
                  </a>
                  <a href="/trainingCertificate" className="px-2 flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <Settings size={20} /> Certification
                  </a>
                  
                </div>
              </>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Sidebar;