import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import useAdminDashbaoardStore from '../stores/AdminStores/useAdminDashboardStore';

const TrainingOverview = ({ totalTrainingCourses, assignmentStatus }) => {
  const { courseAnalytics, isLoadingCourseAnalytics } = useAdminDashbaoardStore();
  
  // Calculate top performing courses (highest completion rate)
  const topCourses = courseAnalytics 
    ? [...courseAnalytics]
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 3)
    : [];
  
  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Training Overview</h3>
      
      {/* Training Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100">
            <AcademicCapIcon className="h-6 w-6 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Total Training Courses</p>
            <p className="text-xl font-semibold">{totalTrainingCourses}</p>
          </div>
        </div>
      </div>
      
      {/* Training Status */}
      <h4 className="font-medium text-gray-700 mb-3">Assignment Status</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">Pending</span>
          </div>
          <span className="text-sm font-semibold">{assignmentStatus.pending}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">In Progress</span>
          </div>
          <span className="text-sm font-semibold">{assignmentStatus.inProgress}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">Completed</span>
          </div>
          <span className="text-sm font-semibold">{assignmentStatus.completed}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">Expired</span>
          </div>
          <span className="text-sm font-semibold">{assignmentStatus.expired}</span>
        </div>
      </div>
      
      {/* Top Performing Courses */}
      {topCourses.length > 0 && (
        <>
          <h4 className="font-medium text-gray-700 mt-6 mb-3">Top Performing Courses</h4>
          <div className="space-y-2">
            {topCourses.map(course => (
              <div key={course.courseId} className="p-2 border border-gray-100 rounded">
                <p className="text-sm font-medium">{course.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.round(course.completionRate)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">{Math.round(course.completionRate)}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/trainingAssignment-list" 
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View All Training
        </Link>
      </div>
    </div>
  );
};

export default TrainingOverview;