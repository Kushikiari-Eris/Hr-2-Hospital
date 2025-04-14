// src/pages/employee/TrainingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useAuthStore from '../../stores/useAuthStore';
import Loading from '../Loading';

const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchUserAssignments, userAssignments, updateAssignment, loading } = useTrainingAssignmentStore();
  const [assignment, setAssignment] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserAssignments(user._id);
    }
  }, [user, fetchUserAssignments]);

  useEffect(() => {
    if (user && userAssignments[user._id]) {
      const foundAssignment = userAssignments[user._id].find(a => a._id === id);
      setAssignment(foundAssignment || null);
    }
  }, [id, user, userAssignments]);

  const handleStartTraining = async () => {
    if (assignment) {
      await updateAssignment(assignment._id, { status: 'in-progress' });
      // Refetch to update UI
      fetchUserAssignments(user._id);
    }
  };

  const handleCompleteTraining = async () => {
    if (assignment) {
      await updateAssignment(assignment._id, { 
        status: 'completed',
        completionDate: new Date().toISOString()
      });
      // Refetch to update UI
      fetchUserAssignments(user._id);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get embed URL from different video providers
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
      const match = url.match(vimeoRegex);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    // Microsoft Stream (assuming a direct embed URL)
    if (url.includes('microsoftstream.com') || url.includes('stream.microsoft.com')) {
      return url; // Microsoft Stream URLs are usually already embedable
    }

    // Wistia
    if (url.includes('wistia.com')) {
      const wistiaRegex = /wistia\.com\/(?:medias|embed)\/(.+)/;
      const match = url.match(wistiaRegex);
      if (match && match[1]) {
        return `https://fast.wistia.net/embed/iframe/${match[1]}`;
      }
    }
    
    // If it's already an embed URL or we can't determine the provider, return as is
    if (url.includes('/embed/') || url.includes('iframe')) {
      return url;
    }
    
    // For direct video files or other URLs, we'll just link to them
    return null;
  };

  // Status indicator component
  const StatusIndicator = ({ status }) => {
    const statusStyles = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'expired': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <div className={`px-4 py-2 rounded-md border ${statusStyles[status] || 'bg-gray-100'}`}>
        <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };


  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Training Not Found</h2>
          <p className="mb-6 text-gray-600">The training assignment you're looking for doesn't exist or you don't have access to view it.</p>
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isDueSoon = () => {
    if (assignment.status !== 'pending' && assignment.status !== 'in-progress') return false;
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isOverdue = () => {
    if (assignment.status === 'completed') return false;
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  const renderTrainingContent = () => {
    if (!assignment.course) return null;
    
    switch (assignment.course.type) {
      case 'video':
        const videoUrl = assignment.course.content;
        const embedUrl = getEmbedUrl(videoUrl);
        
        return (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Training Video</h3>
            <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">

              {embedUrl ? (
                // Use iframe for embedded video
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Training Video"
                  onLoad={() => setIframeLoading(false)}
                ></iframe>
              ) : (
                // Fallback for direct video URLs or unsupported providers
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mb-4">This video needs to be viewed in a separate window.</p>
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => setIframeLoading(false)}
                  >
                    Open Video
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium text-base text-gray-800">{assignment.course.title}</p>
              <div className="flex items-center mt-2">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Duration: {assignment.course.duration} minutes</span>
              </div>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Training Document</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="mb-4">PDF Training Material</p>
              <a href={assignment.course.content} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Open PDF Document
              </a>
            </div>
          </div>
        );
      case 'class':
        return (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Classroom Training</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="mb-4 flex items-start">
                <svg className="w-6 h-6 text-gray-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-medium">Class Details</h4>
                  <p className="text-gray-600 whitespace-pre-line">{assignment.course.content}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mb-8">
            <p className="text-gray-600">Training content unavailable</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">{assignment.course?.title || 'Training Assignment'}</h1>
              <p className="text-gray-600 mt-1">Duration: {assignment.course?.duration || 0} minutes</p>
            </div>
            <StatusIndicator status={assignment.status} />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          {/* Due Date Alert */}
          {isDueSoon() && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This training is due soon on <span className="font-medium">{formatDate(assignment.dueDate)}</span>. Please complete it as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Overdue Alert */}
          {isOverdue() && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    This training is overdue. It was due on <span className="font-medium">{formatDate(assignment.dueDate)}</span>. Please complete it immediately.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{assignment.course?.description || 'No description available'}</p>
          </div>
          
          {/* Training Content */}
          {renderTrainingContent()}
          
          {/* Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Training Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Assigned Date</h4>
                <p>{formatDate(assignment.assignedDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                <p>{formatDate(assignment.dueDate)}</p>
              </div>
              {assignment.status === 'completed' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Completion Date</h4>
                    <p>{formatDate(assignment.completionDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Certification Expires</h4>
                    <p>{formatDate(assignment.certificationExpiry)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            {assignment.status === 'pending' && (
              <button
                onClick={handleStartTraining}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Start Training
              </button>
            )}
            {assignment.status === 'in-progress' && (
              <button
                onClick={handleCompleteTraining}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )}
            {assignment.status === 'completed' && (
            <>
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-md text-center">
                <div className="text-1xl font-semibold text-green-700 mb-2">
                    🎉 Congratulations!
                </div>
                <p className="text-green-600 text-sm mb-4">
                    You have successfully completed the course.
                </p>
                <button 
                    onClick={() => navigate(`/employee/certificate/${assignment._id}`)}
                    className="inline-block px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg shadow-md font-medium"
                >
                    View Certificate
                </button>
                </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetails;