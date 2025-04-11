import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';
import useAuthStore from '../../stores/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { 
    courses, 
    fetchCourses, 
    courseProgress 
  } = useUserLearningStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getProgressPercentage = (courseId) => {
    const progress = courseProgress[courseId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.totalCompleted / progress.totalItems) * 100);
  };

  // Filter courses that have progress
  const coursesInProgress = courses.filter(course => 
    courseProgress[course._id] && 
    getProgressPercentage(course._id) > 0 && 
    getProgressPercentage(course._id) < 100
  );

  // Filter completed courses
  const completedCourses = courses.filter(course => 
    courseProgress[course._id] && 
    getProgressPercentage(course._id) === 100
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        {/* Learning stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Courses</h3>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">In Progress</h3>
            <p className="text-3xl font-bold">{coursesInProgress.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Completed</h3>
            <p className="text-3xl font-bold">{completedCourses.length}</p>
          </div>
        </div>
      </div>
      
      {/* In progress courses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Courses in Progress</h2>
        
        {coursesInProgress.length === 0 ? (
          <p className="text-gray-500 italic">No courses in progress.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesInProgress.map(course => {
              const progressPercent = getProgressPercentage(course._id);
              
              return (
                <Link 
                  to={`/course/${course._id}`} 
                  key={course._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                      Continue Learning →
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Completed courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
        
        {completedCourses.length === 0 ? (
          <p className="text-gray-500 italic">No completed courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map(course => (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completed</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Course Completed</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;