import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';

const TrainingAssignmentList = () => {
  const { assignments, loading, error, fetchAssignments, updateAssignment, deleteAssignment } = useTrainingAssignmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  
  // Filter assignments based on search and status
  const filteredAssignments = assignments.filter(assignment => {
    const userName = assignment.user?.name || '';
    const courseTitle = assignment.course?.title || '';
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || assignment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusChange = async (id, newStatus) => {
    await updateAssignment(id, { status: newStatus });
  };
  
  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(id);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Pending</span>;
      case 'in-progress':
        return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Completed</span>;
      case 'expired':
        return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Expired</span>;
      default:
        return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">{status}</span>;
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading assignments...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Training Assignments</h1>
        <Link to="/trainingAssignment-form" className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
          Assign New Training
        </Link>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0 md:flex-grow">
          <input
            type="text"
            placeholder="Search by user or course..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      
      {/* Assignments Table */}
      {filteredAssignments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Course</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Completion</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.map(assignment => {
                const isOverdue = assignment.status !== 'completed' && 
                                  new Date(assignment.dueDate) < new Date();
                return (
                  <tr key={assignment._id} className={isOverdue ? 'bg-red-50' : ''}>
                    <td className="py-3 px-4">{assignment.user?.name}</td>
                    <td className="py-3 px-4">{assignment.user?.department}</td>
                    <td className="py-3 px-4">{assignment.course?.title}</td>
                    <td className="py-3 px-4">
                      <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(assignment.status)}
                    </td>
                    <td className="py-3 px-4">
                      {assignment.completionDate ? (
                        <div>
                          <div>{new Date(assignment.completionDate).toLocaleDateString()}</div>
                          {assignment.certificationExpiry && (
                            <div className="text-xs text-gray-500">
                              Expires: {new Date(assignment.certificationExpiry).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {assignment.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(assignment._id, 'completed')}
                            className="text-green-500 hover:text-green-700"
                          >
                            Mark Complete
                          </button>
                        )}
                        <Link 
                          to={`/trainingAssignment-form/edit/${assignment._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteAssignment(assignment._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded">
          No assignments found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default TrainingAssignmentList;