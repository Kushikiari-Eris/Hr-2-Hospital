import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';

const TrainingAssignmentList = () => {
  const { assignments, loading, error, fetchAssignments, updateAssignment, deleteAssignment } = useTrainingAssignmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async () => {
    if (courseToDelete) {
      await deleteAssignment(courseToDelete);
      document.getElementById('my_modal_2').close();
    }
  };

  const openDeleteModal = (assignmentId) => {
    setCourseToDelete(assignmentId);
    document.getElementById('my_modal_2').showModal();
  };
  
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
  
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
  return (
    <>
      <nav class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 " aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <a href="/admin-dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
                  <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Home
              </a>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                  <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Training Assignment</span>
              </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
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
        <div className="overflow-x-auto mt-4 border shadow-sm rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                    <td className="py-3 px-4  whitespace-nowrap text-sm font-medium">
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
                          onClick={() => openDeleteModal(assignment._id)}
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
    </div>

    <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          {isLoading ? (
            <ButtonLoading/>
          ) : (
            <>
              <h3 className="font-bold text-lg">Are you sure you want to delete this Training Assignment?</h3>
              <p className="py-4 text-red-600">This action cannot be undone.</p>
              <div className="modal-action">
                <button className="btn text-gray-600" onClick={() => document.getElementById('my_modal_2').close()}>Cancel</button>
                <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
              </div>
            </>
          )}
        </div>
    </dialog>
    </>
  );
};

export default TrainingAssignmentList;