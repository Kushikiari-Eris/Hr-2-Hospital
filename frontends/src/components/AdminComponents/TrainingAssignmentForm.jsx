import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useAuthStore from '../../stores/useAuthStore';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';

const TrainingAssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const { createAssignment, updateAssignment, assignments, fetchAssignments } = useTrainingAssignmentStore();
  const { user, users, fetchUsers } = useAuthStore(); // Fix: assuming the store has a 'users' array
  const { courses, fetchCourses } = useTrainingCourseStore();
  
  const [formData, setFormData] = useState({
    userId: '',
    courseId: '',
    dueDate: '',
    status: 'pending',
    completionDate: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  
// First useEffect to fetch data only once
useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchCourses(),
        isEditMode ? fetchAssignments() : Promise.resolve()
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, [fetchUsers, fetchCourses, fetchAssignments, isEditMode]);
  
  // Second useEffect to set form data after assignments are loaded
  useEffect(() => {
    if (isEditMode && assignments && assignments.length > 0 && !loading) {
      const assignment = assignments.find(a => a._id === id);
      if (assignment) {
        setFormData({
          userId: assignment.user._id,
          courseId: assignment.course._id,
          dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
          status: assignment.status,
          completionDate: assignment.completionDate ? new Date(assignment.completionDate).toISOString().split('T')[0] : ''
        });
      } else {
        navigate('/assignments');
      }
    }
  }, [isEditMode, id, assignments, navigate, loading]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }
    
    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (formData.status === 'completed' && !formData.completionDate) {
      newErrors.completionDate = 'Completion date is required for completed assignments';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    let result;
    if (isEditMode) {
      result = await updateAssignment(id, formData);
    } else {
      result = await createAssignment(formData);
    }
    
    if (result) {
      navigate('/trainingAssignment-list');
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading...</div>;
  
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
            <li aria-current="page">
            <div class="flex items-center">
                <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{isEditMode ? 'Edit Assignment' : 'Assign New Training'}</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
    <div className="container mx-auto px-4 py-8">
      
      <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="userId">
              User
            </label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.userId ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isEditMode} // Can't change user in edit mode
            >
              <option value="">Select User</option>
              {users && users.length > 0 ? (
                users.map(userItem => (
                  <option key={userItem._id} value={userItem._id}>
                    {userItem.name} ({userItem.department})
                  </option>
                ))
              ) : (
                <option value="">No users available</option>
              )}
            </select>
            {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="courseId">
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.courseId ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isEditMode} // Can't change course in edit mode
            >
              <option value="">Select Course</option>
              {courses && courses.length > 0 ? (
                courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title} ({course.type}, {course.duration} mins)
                  </option>
                ))
              ) : (
                <option value="">No courses available</option>
              )}
            </select>
            {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          {(formData.status === 'completed' || formData.completionDate) && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="completionDate">
                Completion Date
              </label>
              <input
                type="date"
                id="completionDate"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.completionDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.completionDate && <p className="text-red-500 text-sm mt-1">{errors.completionDate}</p>}
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/trainingAssignment-list')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            >
              {isEditMode ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </>
  );
};

export default TrainingAssignmentForm;