import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';

const TrainingCourseList = () => {
  const { courses, loading, error, fetchCourses, deleteCourse } = useTrainingCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
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
  
  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'pdf': return 'PDF';
      case 'class': return 'Live Class';
      default: return type;
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading courses...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
  return (
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
            <div key={course._id} className="bg-white rounded-lg shadow overflow-hidden">
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
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/trainingCourse-form/edit/${course._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
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
  );
};

export default TrainingCourseList;