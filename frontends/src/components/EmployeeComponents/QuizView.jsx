import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useUserLearningStore from '../../stores/AdminStores/useUserLearningStore';

const QuizView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { 
    currentQuiz, 
    loading, 
    error, 
    fetchQuiz, 
    submitQuiz,
    clearCurrentQuiz,
    quizResults,
    clearQuizResults,
    currentLesson,
    fetchLesson
  } = useUserLearningStore();
  
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const loadQuizData = async () => {
      // First fetch the lesson to get courseId
      if (!currentLesson) {
        await fetchLesson(lessonId);
      }
      
      const quiz = await fetchQuiz(lessonId);
      
      if (quiz) {
        // Check if quiz is already completed
        if (quiz.completed) {
          // Redirect to results or lesson
          toast.info("You've already completed this quiz. Only one attempt is allowed.");
          navigate(`/lesson/${lessonId}`);
          return;
        }
        
        // Initialize answers with empty values
        const initialAnswers = {};
        quiz.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        
        // Set up timer if there's a time limit
        if (quiz.timeLimit) {
          const timeInSeconds = quiz.timeLimit * 60;
          setTimeLeft(timeInSeconds);
          
          const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerInterval);
                handleSubmitQuiz();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          setTimer(timerInterval);
        }
      } else {
        // Redirect if no quiz found
        navigate(`/lesson/${lessonId}`);
      }
    };
    
    loadQuizData();
    
    return () => {
      if (timer) clearInterval(timer);
      clearCurrentQuiz();
      clearQuizResults();
    };
  }, [lessonId, fetchQuiz, clearCurrentQuiz, clearQuizResults, navigate, currentLesson, fetchLesson]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (timer) clearInterval(timer);
    
    // Convert answers object to array
    const answersArray = Object.values(answers);
    
    // Submit answers and get results
    const courseId = currentLesson?.courseId;
    if (courseId) {
      await submitQuiz(currentQuiz._id, lessonId, courseId, answersArray);
    } else {
      toast.error("Error: Unable to submit quiz, course information missing");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) return <div className="flex justify-center p-8">Loading quiz...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!currentQuiz) return <div className="p-4">Quiz not found</div>;

  // Show warning for one-time attempt
  const QuizWarning = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Important:</strong> You can only take this quiz once. Make sure to review your answers before submitting.
          </p>
        </div>
      </div>
    </div>
  );

  // Show results if quiz has been submitted
  if (quizResults) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
          
          <div className="mb-6 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">Your Score: {quizResults.score}%</h2>
              <div 
                className={`px-3 py-1 rounded-full ${
                  quizResults.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {quizResults.passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <div>Questions: {quizResults.totalQuestions}</div>
              <div>Correct: {quizResults.correctAnswers}</div>
              <div>Passing Score: {currentQuiz.passingScore}%</div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Question Review</h3>
          
          {quizResults.questionResults.map((result, index) => (
            <div 
              key={index} 
              className={`mb-4 p-4 rounded-lg ${
                result.isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <p className="font-medium mb-2">Question {index + 1}: {result.question}</p>
              
              <div className="ml-4">
                <p>
                  Your answer: 
                  <span className={result.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {' '}{currentQuiz.questions[index].options[result.userAnswer]}
                  </span>
                </p>
                
                {!result.isCorrect && (
                  <p>
                    Correct answer: 
                    <span className="text-green-600 font-medium">
                      {' '}{currentQuiz.questions[index].options[result.correctAnswer]}
                    </span>
                  </p>
                )}
                
                {result.explanation && (
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Explanation:</span> {result.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between mt-8">
            <Link 
              to={`/lesson/${lessonId}`}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Return to Lesson
            </Link>
            
            <Link 
              to={`/course/${currentLesson ? currentLesson.courseId : ''}`}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
             Return to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking UI
  const question = currentQuiz.questions[currentQuestion];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 border">
        <h1 className="text-2xl font-bold mb-2">{currentQuiz.title}</h1>
        <p className="text-gray-600 mb-6">{currentQuiz.description}</p>
        
        <QuizWarning />
        
        {/* Quiz navigation and progress */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm">
            Question {currentQuestion + 1} of {currentQuiz.questions.length}
          </div>
          
          {timeLeft > 0 && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          
          <div className="flex space-x-1">
            {currentQuiz.questions.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${idx === currentQuestion 
                    ? 'bg-blue-600 text-white' 
                    : answers[idx] !== null 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Question and answers */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">{question.question}</h2>
          
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div 
                key={idx}
                onClick={() => handleAnswerSelect(currentQuestion, idx)}
                className={`p-3 rounded-md cursor-pointer border transition-colors
                  ${answers[currentQuestion] === idx 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center border
                    ${answers[currentQuestion] === idx 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-400'
                    }`}
                  >
                    {answers[currentQuestion] === idx && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className={`py-2 px-4 rounded 
              ${currentQuestion === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Previous
          </button>
          
          {currentQuestion < currentQuiz.questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
