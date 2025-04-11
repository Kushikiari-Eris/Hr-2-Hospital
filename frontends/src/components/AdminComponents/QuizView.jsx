import React, { useState } from 'react';
import useQuizStore from '../../stores/AdminStores/useQuizStore';
import QuestionForm from './QuestionForm';

const QuizView = ({ quiz, lessonId }) => {
  const { updateQuiz, deleteQuiz, addQuestion, removeQuestion } = useQuizStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: quiz.title,
    description: quiz.description || '',
    passingScore: quiz.passingScore || 70,
    timeLimit: quiz.timeLimit || 30
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'passingScore' || name === 'timeLimit' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateQuiz(quiz._id, formData);
    setIsEditing(false);
  };

  const handleDeleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await deleteQuiz(quiz._id);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await removeQuestion(quiz._id, questionId);
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [questionId]: !expandedQuestions[questionId]
    });
  };

  const handleAddQuestion = async (questionData) => {
    await addQuestion(quiz._id, questionData);
    setShowAddQuestion(false);
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Quiz Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
              <input
                type="number"
                id="passingScore"
                name="passingScore"
                value={formData.passingScore}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">Time Limit (minutes)</label>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
              {quiz.description && <p className="mt-1 text-gray-600">{quiz.description}</p>}
              <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                <span>Passing Score: {quiz.passingScore}%</span>
                <span>Time Limit: {quiz.timeLimit} minutes</span>
                <span>Questions: {quiz?.questions?.length || 0}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit Quiz
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50"
              >
                Delete Quiz
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Questions</h4>
              <button
                onClick={() => setShowAddQuestion(true)}
                className="px-3 py-1 bg-green-600 rounded-md text-sm text-white hover:bg-green-700"
              >
                Add Question
              </button>
            </div>
            
            {quiz.questions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No questions added yet.</p>
            ) : (
              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div key={question._id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleQuestion(question._id)}
                    >
                      <div className="flex-1">
                        <h5 className="font-medium">Question {index + 1}</h5>
                        <p className="text-gray-700">{question.question}</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(question._id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${expandedQuestions[question._id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedQuestions[question._id] && (
                      <div className="p-4 border-t">
                        <h6 className="font-medium mb-2">Options:</h6>
                        <ul className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex} className={`flex items-center ${optIndex === question.correctAnswer ? 'text-green-600 font-medium' : ''}`}>
                              {optIndex === question.correctAnswer && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                        {question.explanation && (
                          <div className="mt-4">
                            <h6 className="font-medium">Explanation:</h6>
                            <p className="text-gray-600">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {showAddQuestion && (
        <QuestionForm
          onSubmit={handleAddQuestion}
          onCancel={() => setShowAddQuestion(false)}
        />
      )}
    </div>
  );
};

export default QuizView;