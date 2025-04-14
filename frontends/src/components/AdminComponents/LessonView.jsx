import React, { useEffect, useState } from 'react';
import useLessonStore from '../../stores/AdminStores/useLessonStore';
import useQuizStore from '../../stores/AdminStores/useQuizStore';
import { useNavigate, useParams } from 'react-router-dom';
import useAllCoursesStore from '../../stores/AdminStores/useAllCoursesStore';
import QuizView from './QuizView';
import CreateQuizForm from './CreateQuizForm';

const LessonView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { lessons, fetchLessonsByCourse, loading: lessonLoading } = useLessonStore();
  const { courses, fetchCourses } = useAllCoursesStore();
  const { currentQuiz, fetchQuizByLesson, loading: quizLoading } = useQuizStore();
  const [course, setCourse] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  useEffect(() => {
    // Fetch the course details and lessons
    const loadData = async () => {
      if (!courses.length) {
        await fetchCourses();
      }
      await fetchLessonsByCourse(courseId);
    };
    
    loadData();
  }, [courseId, fetchLessonsByCourse, courses.length, fetchCourses]);

  useEffect(() => {
    // Find the current course from the list
    if (courses.length > 0 && courseId) {
      const foundCourse = courses.find(c => c._id === courseId);
      setCourse(foundCourse);
    }
  }, [courses, courseId]);
  
  useEffect(() => {
    // For each lesson, fetch its quiz
    const fetchQuizzes = async () => {
      if (lessons.length > 0) {
        for (const lesson of lessons) {
          await fetchQuizByLesson(lesson._id);
        }
      }
    };
    
    fetchQuizzes();
  }, [lessons, fetchQuizByLesson]);

  return (
    <>
      <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/admin-dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <a href="/all-courses" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">All Courses</a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">{course?.title || 'Course'} Lessons</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Lessons Section */}
      <div className="p-6 border mt-5 rounded-lg bg-white shadow-sm">
        {lessonLoading ? (
          <div className="text-center p-10">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No lessons found</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {lessons.map((lesson) => (
              <div key={lesson._id} className="">
                <h2 className="text-2xl font-semibold text-gray-800">{lesson.title}</h2>
                <p className="mt-2 text-gray-600 whitespace-pre-line">{lesson.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Section */}
      <div className="p-6 border mt-5 rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Quiz</h2>
          
          {!currentQuiz && !showCreateQuiz && (
            <button 
              onClick={() => setShowCreateQuiz(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Quiz
            </button>
          )}
        </div>
        
        {quizLoading ? (
          <div className="text-center p-10">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : currentQuiz ? (
          <QuizView quiz={currentQuiz} lessonId={lessons[0]?._id} />
        ) : showCreateQuiz ? (
          <CreateQuizForm 
            lessonId={lessons[0]?._id} 
            onCancel={() => setShowCreateQuiz(false)}
          />
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No quiz found for this lesson</h3>
            <p className="mt-1 text-sm text-gray-500">Click the "Create Quiz" button to add a quiz.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LessonView;