import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';
import { marked } from 'marked';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const {
    currentLesson,
    loading,
    error,
    fetchLesson,
    fetchQuiz,
    clearCurrentLesson,
    currentCourse,
    fetchCourse,
    markLessonCompleted,
    completedQuizzes
  } = useUserLearningStore();
  
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState('');

  useEffect(() => {
    const loadLessonData = async () => {
      // Fetch lesson data
      const lessonData = await fetchLesson(lessonId);
      
      if (lessonData) {
        // Always parse the content when the lesson is loaded
        setLessonContent(marked.parse(lessonData.content || ''));
        
        // If lesson has a courseId, fetch course details if not loaded
        if (lessonData.courseId && (!currentCourse || currentCourse._id !== lessonData.courseId)) {
          await fetchCourse(lessonData.courseId);
        }
      }
      
      // Check if there's a quiz for this lesson
      setQuizLoading(true);
      try {
        const quizData = await fetchQuiz(lessonId);
        setQuiz(quizData);
      } catch (error) {
        console.log("No quiz found or error fetching quiz");
      } finally {
        setQuizLoading(false);
      }
    };
    
    loadLessonData();
    
    return () => clearCurrentLesson();
  }, [lessonId, fetchLesson, clearCurrentLesson, fetchCourse, currentCourse, fetchQuiz]);

  // Function to mark lesson as completed
  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    
    try {
      const result = await markLessonCompleted(lessonId, currentLesson.courseId);
      
      if (result) {
        toast.success("Lesson marked as completed!");
        
        // If there's a quiz and it's not completed, navigate to it
        if (quiz && !isQuizCompleted()) {
          navigate(`/quiz/${lessonId}`);
        } else {
          // If there's no quiz or quiz is already completed
          if (currentCourse) {
            navigate(`/course/${currentCourse._id}`);
          } else {
            navigate('/course-list');
            toast.info("Returning to course list");
          }
        }
      } else {
        toast.error("Failed to mark lesson as completed");
      }
    } catch (error) {
      toast.error("An error occurred while updating progress");
      console.error(error);
    }
  };

  // Check if lesson's quiz has already been completed
  const isQuizCompleted = () => {
    if (!quiz) return false;
    
    // Check both the quiz state and completedQuizzes from the store
    return quiz.completed || (completedQuizzes && completedQuizzes.includes(quiz._id));
  };

  if (loading) return <div className="flex justify-center p-8">Loading lesson content...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!currentLesson) return <div className="p-4">Lesson not found</div>;

  return (
    <div className="container mx-auto p-4">
      {currentCourse && (
        <Link to={`/course/${currentCourse._id}`} className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to {currentCourse.title}
        </Link>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        {currentLesson.image && (
          <div className="h-64 bg-gray-200">
            <img 
              src={currentLesson.image} 
              alt={currentLesson.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            <div className="text-gray-500 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{currentLesson.duration || '15'} min</span>
            </div>
          </div>
          
          {/* Lesson content */}
          {lessonContent && (
            <div 
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            />
          )}
          
          {/* Quiz status and lesson completion */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between">
            <div className="mb-4 sm:mb-0">
              {quizLoading ? (
                <div className="text-gray-500">Checking for quiz...</div>
              ) : quiz ? (
                <div>
                  <p className="mb-2">
                    <span className="font-medium">Quiz:</span> {quiz.title || "Lesson Quiz"}
                  </p>
                  
                  {isQuizCompleted() ? (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Quiz completed</span>
                    </div>
                  ) : (
                    <Link 
                      to={`/quiz/${lessonId}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Take Quiz</span>
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No quiz available for this lesson</p>
              )}
            </div>
            
            <button
              onClick={handleMarkComplete}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;