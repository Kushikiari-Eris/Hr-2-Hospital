import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ButtonLoading from '../ButtonLoading';
import useAllCoursesStore from '../../stores/AdminStores/useAllCoursesStore';
import useLessonStore from '../../stores/AdminStores/useLessonStore';

const LessonList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { lessons, fetchLessonsByCourse, deleteLesson, loading, createLesson, updateLesson, error, currentLesson } = useLessonStore();
  const { courses, fetchCourses } = useAllCoursesStore();
  const [course, setCourse] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0,
    duration: 0,
    isPublished: false,
    resources: [],
    courseId: courseId
  });

  useEffect(() => {
    if (currentLesson) {
      setFormData({
        ...currentLesson,
        resources: currentLesson.resources || []
      });
    }
  }, [currentLesson]);


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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (currentLesson) {
      await updateLesson(currentLesson._id, formData);
    } else {
      await createLesson(formData);
    }
    document.getElementById('my_modal_1').close();
    useLessonStore.getState().setCurrentLesson(null); // reset
    setFormData({
      title: '',
      content: '',
      order: 0,
      duration: 0,
      isPublished: false,
      resources: [],
      courseId: courseId
    });
    setIsLoading(false);
  };
  

  const handleDelete = async () => {
    if (lessonToDelete) {
      await deleteLesson(lessonToDelete);
      document.getElementById('delete_modal').close();
      setLessonToDelete(null);
    }
  };

  const closeModal = () => {
    document.getElementById("my_modal_1").close();
    useLessonStore.getState().setCurrentLesson(null);
    setFormData({
      title: '',
      content: '',
      order: 0,
      duration: 0,
      isPublished: false,
      resources: [],
      courseId: courseId
    });
  };
  


  const openDeleteModal = (lessonId) => {
    setLessonToDelete(lessonId);
    document.getElementById('delete_modal').showModal();
  };

  const handleAddLesson = () => {
    useLessonStore.getState().setCurrentLesson(null); // clear any selected lesson
    setFormData({
      title: '',
      content: '',
      order: 0,
      duration: 0,
      isPublished: false,
      resources: [],
      courseId: courseId
    });
    document.getElementById('my_modal_1').showModal();
  };
  
  const handleEditLesson = (lesson) => {
    useLessonStore.getState().setCurrentLesson(lesson); // set current lesson
    document.getElementById('my_modal_1').showModal();
  };
  
  const handleViewLesson = (lessonId) => {
    navigate(`/admin/courses/${courseId}/lessons/${lessonId}`);
  };

  if (loading && !lessons.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
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

      <div className="p-6 border mt-5 rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl text-gray-900 font-semibold">{course?.title || 'Course'} Lessons</h2>
            <p className="text-gray-600 mt-1">{course?.description || ''}</p>
          </div>
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleAddLesson}
          >
            Add Lesson
          </button>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No lessons found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new lesson.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleAddLesson}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Lesson
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.duration} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {lesson.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewLesson(lesson._id)} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button 
                         onClick={() => handleEditLesson(lesson)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(lesson._id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
       
    <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-full max-w-2xl">
            {isLoading ? (
                <div className="flex items-center justify-center h-60">
                <ButtonLoading />
                </div>
            ) : (
                <>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">📘 Lesson Details</h3>
            {course && (
            <p className="text-sm text-gray-500 mb-2">Course: <span className="font-medium">{course.title}</span></p>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title</label>
                <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter lesson title"
                required
                />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">Content</label>
                <textarea
                name="content"
                id="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Write lesson content..."
                required
                />
            </div>

            {/* Order & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="order">Order</label>
                <input
                    type="number"
                    name="order"
                    id="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="e.g. 1"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration">Duration (min)</label>
                <input
                    type="number"
                    name="duration"
                    id="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="e.g. 45"
                />
                </div>
            </div>

            {/* Published */}
            <div className="flex items-center space-x-3">
                <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="checkbox checkbox-primary"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700">Mark as Published</label>
            </div>

            {/* Actions */}
            <div className="modal-action mt-6 flex justify-end space-x-3">
            <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="btn btn-primary"
            >
                {currentLesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
            </div>
            </form>
            </>
            )}
        </div>
    </dialog>



      {/* Delete Modal */}
    <dialog id="delete_modal" className="modal">
    <div className="modal-box">
        {isLoading ? (
        <ButtonLoading/>
        ) : (
        <>
            <h3 className="font-bold text-lg">Are you sure you want to delete this course?</h3>
            <p className="py-4 text-red-600">This action cannot be undone.</p>
            <div className="modal-action">
            <button className="btn text-gray-600" onClick={() => document.getElementById('delete_modal').close()}>Cancel</button>
            <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
            </div>
        </>
        )}
    </div>
    </dialog>
    </>
  );
};

export default LessonList;