import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { 
    currentCourse, 
    loading, 
    error, 
    fetchCourse, 
    fetchLessons,
    courseProgress,
    completedQuizzes
  } = useUserLearningStore();
  
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const loadCourseData = async () => {
      await fetchCourse(courseId);
      const fetchedLessons = await fetchLessons(courseId);
      setLessons(fetchedLessons || []);
    };
    
    loadCourseData();
  }, [courseId, fetchCourse, fetchLessons]);

  const handleStartCourse = () => {
    if (lessons.length > 0) {
      navigate(`/lesson/${lessons[0]._id}`);
    }
  };

  const getProgressPercentage = () => {
    const progress = courseProgress[courseId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.totalCompleted / progress.totalItems) * 100);
  };

  const isLessonCompleted = (lessonId) => {
    const progress = courseProgress[courseId];
    return progress && progress.completedLessons.includes(lessonId);
  };

  const isQuizCompleted = (lessonId) => {
    const quizId = useUserLearningStore.getState().lessonQuizMap[lessonId];
    return quizId && completedQuizzes.includes(quizId);
  };

  if (loading) return <div className="flex justify-center p-8">Loading course details...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!currentCourse) return <div className="p-4">Course not found</div>;

  const progressPercent = getProgressPercentage();

  return (
    <div className="container mx-auto p-4">
      <Link to="/course-list" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Courses
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        {currentCourse.image && (
          <div className="h-64 bg-gray-200">
            <img 
              src={currentCourse.image} 
              alt={currentCourse.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{currentCourse.title}</h1>
          
          {/* Course progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Course Progress</h3>
              <span className="text-blue-600 font-medium">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p>{currentCourse.description}</p>
          </div>
          
          {lessons.length > 0 ? (
            <>
              <button 
                onClick={handleStartCourse}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 mb-8"
              >
                {progressPercent > 0 ? 'Continue Course' : 'Start Course'}
              </button>
              
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="border rounded-md divide-y">
                {lessons.sort((a, b) => a.order - b.order).map(lesson => {
                  const lessonComplete = isLessonCompleted(lesson._id);
                  const quizComplete = isQuizCompleted(lesson._id);
                  
                  return (
                    <Link 
                      key={lesson._id} 
                      to={`/lesson/${lesson._id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center">
                          {/* Status indicator */}
                          <div className="mr-3">
                            {lessonComplete ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Lesson details */}
                          <div className="flex-grow">
                            <span className="font-medium">{lesson.title}</span>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span>{lesson.duration} min</span>
                              
                              {/* Quiz status */}
                              <div className="ml-4 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>
                                  Quiz: {quizComplete ? (
                                    <span className="text-green-600">Completed</span>
                                  ) : (
                                    <span>Not taken</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No lessons available for this course yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;