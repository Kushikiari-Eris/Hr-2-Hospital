import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';
import useAuthStore from '../../stores/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Training Assignment Store
  const { fetchUserAssignments, userAssignments, loading: assignmentsLoading } = useTrainingAssignmentStore();
  const [assignments, setAssignments] = useState([]);
  
  // User Learning Store
  const { courses, fetchCourses, courseProgress, loading: coursesLoading } = useUserLearningStore();

  useEffect(() => {
    if (user) {
      fetchUserAssignments(user._id);
      fetchCourses();
    }
  }, [user, fetchUserAssignments, fetchCourses]);

  useEffect(() => {
    if (user && userAssignments[user._id]) {
      setAssignments(userAssignments[user._id]);
    }
  }, [user, userAssignments]);

  // Calculate assignment statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress').length;
  const expiredAssignments = assignments.filter(a => a.status === 'expired').length;

  // Calculate course progress
  const getProgressPercentage = (courseId) => {
    const progress = courseProgress[courseId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.totalCompleted / progress.totalItems) * 100);
  };

  const coursesInProgress = courses.filter(course => 
    courseProgress[course._id] && 
    getProgressPercentage(course._id) > 0 && 
    getProgressPercentage(course._id) < 100
  );

  const completedCourses = courses.filter(course => 
    courseProgress[course._id] && 
    getProgressPercentage(course._id) === 100
  );

  // Chart data for training status
  const chartOptions = {
    labels: ['Completed', 'In Progress', 'Pending', 'Expired'],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const chartSeries = [
    completedAssignments,
    inProgressAssignments,
    pendingAssignments,
    expiredAssignments
  ];

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2 border">
          <h3 className="text-gray-500 text-sm font-medium">Total Trainings</h3>
          <p className="text-3xl font-bold">{totalAssignments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedAssignments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{inProgressAssignments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingAssignments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h3 className="text-gray-500 text-sm font-medium">Courses</h3>
          <p className="text-3xl font-bold text-indigo-600">{courses.length}</p>
        </div>
      </div>
      
      {/* Chart & Upcoming Trainings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Training Status Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h2 className="text-lg font-semibold mb-4">Training Status</h2>
          {totalAssignments > 0 ? (
            <Chart 
              options={chartOptions}
              series={chartSeries}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No training data available
            </div>
          )}
        </div>
        
        {/* Upcoming Trainings */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2 border">
          <h2 className="text-lg font-semibold mb-4">Upcoming & In-Progress Trainings</h2>
          {assignments.filter(a => a.status === 'pending' || a.status === 'in-progress').length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments
                    .filter(a => a.status === 'pending' || a.status === 'in-progress')
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((assignment) => (
                      <tr key={assignment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{assignment.course.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(assignment.dueDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={assignment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => navigate(`/employee/training/${assignment._id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No upcoming or in-progress trainings
            </div>
          )}
        </div>
      </div>

      {/* Recent Completed Trainings */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border">
        <h2 className="text-lg font-semibold mb-4">Recently Completed Trainings</h2>
        {assignments.filter(a => a.status === 'completed').length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certification Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments
                  .filter(a => a.status === 'completed')
                  .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
                  .slice(0, 5)
                  .map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.course.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(assignment.completionDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {assignment.certificationExpiry ? formatDate(assignment.certificationExpiry) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => navigate(`/employee/certificate/${assignment._id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No completed trainings
          </div>
        )}
      </div>
      
      {/* In Progress Courses */}
      <div className="mb-8 ">
        <h2 className="text-xl font-semibold mb-4">Courses in Progress</h2>
        
        {coursesInProgress.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 border">
            No courses in progress.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
            {coursesInProgress.map(course => {
              const progressPercent = getProgressPercentage(course._id);
              
              return (
                <Link 
                  to={`/course/${course._id}`} 
                  key={course._id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 border"
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


      {/* Completed Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
        
        {completedCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 border">
            No completed courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {completedCourses.map(course => (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 border"
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