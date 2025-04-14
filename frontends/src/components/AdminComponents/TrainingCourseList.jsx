import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';

const TrainingCourseList = () => {
  const { courses, loading, error, fetchCourses, deleteCourse } = useTrainingCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  // Filter courses based on search and type
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || course.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const handleDelete = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete);
      document.getElementById('my_modal_2').close();
    }
  };

  const openDeleteModal = (courseId) => {
    setCourseToDelete(courseId);
    document.getElementById('my_modal_2').showModal();
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'pdf': return 'PDF';
      case 'class': return 'Live Class';
      default: return type;
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
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Training Courses</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Training Courses</h1>
        <Link to="/trainingCourse-form" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Add New Training Course
        </Link>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0 md:flex-grow">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="class">Live Class</option>
          </select>
        </div>
      </div>
      
      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course._id} className="bg-white rounded-lg border shadow overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.type === 'video' ? 'bg-blue-100 text-blue-800' :
                    course.type === 'pdf' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getTypeLabel(course.type)}
                  </span>
                  <span className="text-sm text-gray-600">{course.duration} mins</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">
                      Certification valid for {course.expiryPeriod} months
                    </span>
                  </div>
                  
                  <div className="flex space-x-2  whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/trainingCourse-view/${course._id}`}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/trainingCourse-form/edit/${course._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(course._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded">
          No courses found matching your criteria.
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
            <h3 className="font-bold text-lg">Are you sure you want to delete this course?</h3>
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

export default TrainingCourseList;