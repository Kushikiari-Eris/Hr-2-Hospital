import React from 'react';
import { BookOpenIcon, DocumentTextIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const CoursesOverview = ({ totalCourses, totalLessons, totalQuizzes, recentCourses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Courses Overview</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpenIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{totalCourses}</p>
          <p className="text-sm text-gray-500">Courses</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <DocumentTextIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{totalLessons}</p>
          <p className="text-sm text-gray-500">Lessons</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <QuestionMarkCircleIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{totalQuizzes}</p>
          <p className="text-sm text-gray-500">Quizzes</p>
        </div>
      </div>
      
      {/* Recent Courses */}
      <h4 className="font-medium text-gray-700 mb-3">Recent Courses</h4>
      <div className="space-y-3">
        {recentCourses.map((course) => (
          <Link 
            key={course._id} 
            to={`/courses/${course._id}`}
            className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0 rounded bg-blue-100 flex items-center justify-center">
                <BookOpenIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                <p className="text-xs text-gray-500">Created {new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          to="/all-courses" 
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesOverview;