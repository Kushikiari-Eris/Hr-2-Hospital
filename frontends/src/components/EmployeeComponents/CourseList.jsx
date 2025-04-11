import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';

const CourseList = () => {
  const { 
    courses, 
    loading, 
    error, 
    fetchCourses,
    courseProgress
  } = useUserLearningStore();
  
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCourses();
      } catch (err) {
        console.error("Error in component while fetching courses:", err);
      } finally {
        // Use a local loading state as a fallback
        setLocalLoading(false);
      }
    };
    
    loadData();
    
    // Safety timeout - force loading to false after 5 seconds
    const timeout = setTimeout(() => setLocalLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, [fetchCourses]);

  const getProgressPercentage = (courseId) => {
    const progress = courseProgress[courseId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.totalCompleted / progress.totalItems) * 100);
  };

  // Use either the store loading state or local loading state
  if (loading && localLoading) return <div className="flex justify-center p-8">Loading courses...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
      
      {courses.length === 0 ? (
        <p>No courses available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const progressPercent = getProgressPercentage(course._id);
            
            return (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rest of your component stays the same */}
                <div className="h-48 bg-gray-200 relative">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2">{course.title}</h2>
                  <p className="text-gray-600 line-clamp-3 mb-4">{course.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-2">
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
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;