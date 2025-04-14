// src/pages/staff/EmployeeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';
import useAuthStore from '../../stores/useAuthStore';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, users } = useAuthStore();
  const { fetchUserAssignments, userAssignments, updateAssignment, loading } = useTrainingAssignmentStore();
  const { courses, fetchCourses } = useTrainingCourseStore();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchUserById(id).then(user => {
      if (user) setEmployee(user);
    });
    fetchUserAssignments(id);
    fetchCourses();
  }, [id, fetchUserById, fetchUserAssignments, fetchCourses]);

  useEffect(() => {
    if (userAssignments[id]) {
      setAssignments(userAssignments[id]);
    }
  }, [id, userAssignments]);

  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress').length;
  const expiredAssignments = assignments.filter(a => a.status === 'expired').length;
  const overdueDates = assignments.filter(a => 
    (a.status === 'pending' || a.status === 'in-progress') && 
    new Date(a.dueDate) < new Date()
  ).length;

  // Compliance rate calculation
  const complianceRate = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  // Chart data for training status
  const statusChartOptions = {
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

  const statusChartSeries = [
    completedAssignments,
    inProgressAssignments,
    pendingAssignments,
    expiredAssignments
  ];

  // Chart data for completion timeline
  const timelineChartOptions = {
    chart: {
      height: 280,
      type: 'rangeBar'
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    }
  };

  const timelineChartSeries = [{
    name: "Training Timeline",
    data: assignments
      .filter(assignment => assignment.assignedDate)
      .map(assignment => ({
        x: assignment.course?.title || 'Unnamed Course',
        y: [
          new Date(assignment.assignedDate).getTime(),
          assignment.completionDate 
            ? new Date(assignment.completionDate).getTime() 
            : new Date().getTime()
        ],
        fillColor: assignment.status === 'completed' 
          ? '#10b981' 
          : assignment.status === 'in-progress' 
            ? '#3b82f6' 
            : '#f59e0b'
      }))
  }];

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle assign new training
  const handleAssignTraining = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !dueDate) return;
    
    try {
      const newAssignment = {
        userId: id,
        courseId: selectedCourse,
        dueDate: new Date(dueDate).toISOString(),
        assignedDate: new Date().toISOString(),
        status: 'pending'
      };
      
      // Call API to create assignment
      // For demo, we'll just console.log
      console.log("New assignment:", newAssignment);
      
      // Close modal and reset form
      setShowAssignModal(false);
      setSelectedCourse('');
      setDueDate('');
      
      // Refetch assignments to update UI
      fetchUserAssignments(id);
    } catch (error) {
      console.error("Failed to assign training:", error);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Employee Not Found</h2>
          <p className="mb-6 text-gray-600">The employee you're looking for doesn't exist or you don't have permission to view their details.</p>
          <button 
            onClick={() => navigate('/staff/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/staff/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Employee Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <p className="text-gray-600">{employee.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap space-x-2">
              <button 
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Assign Training
              </button>
              <button
                onClick={() => navigate(`/staff/employee/${id}/history`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                View History
              </button>
            </div>
          </div>
        </div>
        
        {/* Employee Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5">
          <div className="p-6 text-center border-r border-b border-gray-200">
            <div className="text-3xl font-bold text-indigo-600">{complianceRate}%</div>
            <div className="text-sm text-gray-500">Compliance Rate</div>
          </div>
          <div className="p-6 text-center border-r border-b border-gray-200">
            <div className="text-3xl font-bold text-green-600">{completedAssignments}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="p-6 text-center border-r border-b border-gray-200">
            <div className="text-3xl font-bold text-blue-600">{inProgressAssignments}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="p-6 text-center border-r border-b border-gray-200">
            <div className="text-3xl font-bold text-yellow-600">{pendingAssignments}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="p-6 text-center border-b border-gray-200">
            <div className="text-3xl font-bold text-red-600">{overdueDates}</div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Training Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Training Status</h2>
          {totalAssignments > 0 ? (
            <Chart 
              options={statusChartOptions}
              series={statusChartSeries}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No training data available
            </div>
          )}
        </div>
        
        {/* Training Timeline Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Training Timeline</h2>
          {assignments.length > 0 ? (
            <Chart 
              options={timelineChartOptions}
              series={timelineChartSeries}
              type="rangeBar"
              height={300}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No timeline data available
            </div>
          )}
        </div>
      </div>
      
      {/* Active Training Assignments */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Training Assignments</h2>
        {assignments.filter(a => a.status !== 'completed').length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments
                  .filter(a => a.status !== 'completed')
                  .sort((a, b) => {
                    if (a.status === 'expired' && b.status !== 'expired') return -1;
                    if (a.status !== 'expired' && b.status === 'expired') return 1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                  })
                  .map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.course?.title}</div>
                        <div className="text-xs text-gray-500">{assignment.course?.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(assignment.assignedDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(assignment.dueDate)}
                          {new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed' && (
                            <span className="text-xs text-red-600 ml-2">(Overdue)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={assignment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/staff/training/${assignment._id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              // Logic to send reminder
                              console.log(`Reminder sent for assignment ${assignment._id}`);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Send Reminder
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No active training assignments
          </div>
        )}
      </div>
      
      {/* Completed Trainings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Completed Trainings</h2>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments
                  .filter(a => a.status === 'completed')
                  .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
                  .map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.course?.title}</div>
                        <div className="text-xs text-gray-500">{assignment.course?.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(assignment.completionDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(assignment.certificationExpiry)}
                          {assignment.certificationExpiry && new Date(assignment.certificationExpiry) < new Date(new Date().setMonth(new Date().getMonth() + 3)) && (
                            <span className="text-xs text-yellow-600 ml-2">(Expires Soon)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(`/certificates/${assignment._id}`, '_blank')}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Certificate
                          </button>
                          <button 
                            onClick={() => {
                              // Logic to reassign
                              console.log(`Reassigning course ${assignment.course._id} to user ${id}`);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reassign
                          </button>
                        </div>
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

      {/* Assign Training Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Assign New Training</h3>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAssignTraining}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Course
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Assign Training
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;