import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';

const TrainingCourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const { createCourse, updateCourse, courses, fetchCourses } = useTrainingCourseStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    content: '',
    duration: '',
    expiryPeriod: '12'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (isEditMode) {
      // If editing, load course data
      const loadCourse = async () => {
        // Make sure courses are loaded
        if (!courses.length) {
          await fetchCourses();
        }
        
        const course = courses.find(c => c._id === id);
        if (course) {
          setFormData({
            title: course.title,
            description: course.description,
            type: course.type,
            content: course.content,
            duration: course.duration.toString(),
            expiryPeriod: course.expiryPeriod.toString()
          });
        } else {
          navigate('/courses');
        }
      };
      
      loadCourse();
    }
  }, [isEditMode, id, courses, fetchCourses, navigate]);
  
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    if (!formData.expiryPeriod.trim()) {
      newErrors.expiryPeriod = 'Expiry period is required';
    } else if (isNaN(formData.expiryPeriod) || Number(formData.expiryPeriod) <= 0) {
      newErrors.expiryPeriod = 'Expiry period must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert string numbers to actual numbers
    const courseData = {
      ...formData,
      duration: Number(formData.duration),
      expiryPeriod: Number(formData.expiryPeriod)
    };
    
    let result;
    if (isEditMode) {
      result = await updateCourse(id, courseData);
    } else {
      result = await createCourse(courseData);
    }
    
    if (result) {
      navigate('/trainingCourse-list');
    }
  };
  
  const getContentLabel = () => {
    switch (formData.type) {
      case 'video': return 'Video URL';
      case 'pdf': return 'PDF URL';
      case 'class': return 'Class Details';
      default: return 'Content';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Training Course' : 'Add New Training Course'}
      </h1>
      
      <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Training Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="type">
              Course Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="class">Live Class</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="content">
              {getContentLabel()}
            </label>
            <input
              type="text"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={formData.type === 'video' ? 'Enter video URL' : 
                        formData.type === 'pdf' ? 'Enter PDF URL' : 
                        'Enter class details (location, instructor, etc.)'}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
              min="1"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="expiryPeriod">
              Certification Valid For (months)
            </label>
            <input
              type="number"
              id="expiryPeriod"
              name="expiryPeriod"
              value={formData.expiryPeriod}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.expiryPeriod ? 'border-red-500' : 'border-gray-300'}`}
              min="1"
            />
            {errors.expiryPeriod && <p className="text-red-500 text-sm mt-1">{errors.expiryPeriod}</p>}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/trainingCourse-list')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              {isEditMode ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingCourseForm;