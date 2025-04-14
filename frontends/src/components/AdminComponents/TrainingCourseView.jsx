import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';

const TrainingCourseView = () => {
  const { id } = useParams();
  const { getCourseById } = useTrainingCourseStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(id);
        setCourse(courseData);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, getCourseById]);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'pdf': return 'PDF';
      case 'class': return 'Live Class';
      default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
          </svg>
        );
      case 'pdf':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'class':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <>
      <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/admin-dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <Link to="/training-courses" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                Training Courses
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                {course.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${
                  course.type === 'video' ? 'bg-blue-100 text-blue-800' :
                  course.type === 'pdf' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <span className="mr-1">{getTypeIcon(course.type)}</span>
                  {getTypeLabel(course.type)}
                </div>
                <span className="ml-4 text-gray-600">{course.duration} minutes</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Link 
                to={`/trainingCourse-form/edit/${course._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Course
              </Link>
              <Link 
                to="/trainingCourse-list"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 rounded flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to List
              </Link>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Course Details</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Description</h3>
                <p className="text-gray-700  whitespace-pre-line">
                    {course.description}
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Course Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{getTypeLabel(course.type)}</span>
                    </div>
                    
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration} minutes</span>
                    </div>
                    
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Certification Period:</span>
                      <span className="font-medium">{course.expiryPeriod} months</span>
                    </div>
                    
                    {course.instructor && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                    )}
                    
                    {course.createdAt && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {course.updatedAt && (
                      <div className="flex justify-between pb-2">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Content</h3>
                  
                  {course.type === 'video' && course.content && (
                    <div className="mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                        <svg className="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium">Course Video</h4>
                          <a 
                            href={course.content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Watch Video
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {course.type === 'pdf' && course.content && (
                    <div className="mb-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                        <svg className="w-8 h-8 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium">Course PDF</h4>
                          <a 
                            href={course.content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:underline text-sm"
                          >
                            View PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {course.type === 'class' && course.content && (
                    <div className="mb-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                        <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium">Live Class</h4>
                          <a 
                            href={course.content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline text-sm"
                          >
                            Join Class
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {course.additionalResources && course.content.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Resources</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {course.additionalResources.map((resource, index) => (
                          <li key={index}>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {resource.title || `Resource ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!((course.type === 'video' && course.content) || 
                     (course.type === 'pdf' && course.content) || 
                     (course.type === 'class' && course.content) ||
                     (course.additionalResources && course.content.length > 0)) && (
                    <div className="text-center py-4 text-gray-500">
                      No resources available for this course.
                    </div>
                  )}
                </div>
              </div>
              
              {course.requirements && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Prerequisites & Requirements</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {typeof course.requirements === 'string' 
                      ? <li>{course.requirements}</li>
                      : course.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))
                    }
                  </ul>
                </div>
              )}
              
              {course.objectives && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Learning Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {typeof course.objectives === 'string' 
                      ? <li>{course.objectives}</li>
                      : course.objectives.map((obj, index) => (
                          <li key={index} className="text-gray-700">{obj}</li>
                        ))
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingCourseView;