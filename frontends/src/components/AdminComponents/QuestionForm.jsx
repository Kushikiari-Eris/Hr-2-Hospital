import React, { useState } from 'react';

const QuestionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  );
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user fixes the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    
    setFormData({
      ...formData,
      options: updatedOptions
    });
    
    // Clear option error
    if (errors.options) {
      setErrors({
        ...errors,
        options: null
      });
    }
  };

  const handleCorrectAnswerChange = (index) => {
    setFormData({
      ...formData,
      correctAnswer: index
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    const emptyOptions = formData.options.filter(
      (option) => !option.trim()
    );
    
    if (emptyOptions.length > 0) {
      newErrors.options = 'All options must be filled';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      
      setFormData({
        ...formData,
        options: updatedOptions,
        correctAnswer: formData.correctAnswer >= index && formData.correctAnswer > 0
          ? formData.correctAnswer - 1
          : formData.correctAnswer
      });
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Question' : 'Add New Question'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Question
          </label>
          <textarea
            id="question"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            rows="2"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.question && (
            <p className="text-red-500 text-xs mt-1">{errors.question}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {formData.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Add Option
              </button>
            )}
          </div>
          
          {errors.options && (
            <p className="text-red-500 text-xs mb-2">{errors.options}</p>
          )}
          
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`correctAnswer-${index}`}
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
            Explanation (Optional)
          </label>
          <textarea
            id="explanation"
            name="explanation"
            value={formData.explanation}
            onChange={handleInputChange}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Explain why the correct answer is right"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {initialData ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;