import React, { useEffect, useState } from 'react';
import useAllCoursesStore from '../../stores/AdminStores/useAllCoursesStore';
import ButtonLoading from '../ButtonLoading';
import { useNavigate } from 'react-router-dom';

const Admin_AllCourses = () => {
    const { courses = [], fetchCourses, deleteCourse, addCourse, updateCourse } = useAllCoursesStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchCourses();
    }, [fetchCourses]);
  
    const handleDelete = async () => {
      if (courseToDelete) {
        await deleteCourse(courseToDelete);
        document.getElementById('my_modal_2').close();
      }
    };
  
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          convertToBase64(file).then((base64) => {
            setImage(base64); // Update state with the base64 string
          });
        }
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (editingCourse) {
            // Update existing course
            await updateCourse(editingCourse._id, { title, description, image });
        } else {
            // Add new course
            await addCourse({ title, description, image });
        }
        setTitle("");
        setDescription("");
        setImage(null);
        setEditingCourse(null); // Reset editing state
    
        // Close modal safely
        const modal = document.getElementById('my_modal_1');
        if (modal) modal.close();
    
        setIsLoading(false);
    };
    const openDeleteModal = (courseId) => {
      setCourseToDelete(courseId);
      document.getElementById('my_modal_2').showModal();
    };
  
    const openEditModal = (course) => {
        setEditingCourse(course);
        setTitle(course.title);
        setDescription(course.description);
        setImage(course.image || ""); // Ensure it's not null
        document.getElementById('my_modal_1').showModal();
      };
      
  
    return (
      <>
      
        <nav class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 " aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                <a href="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
                    <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                </a>
                </li>
                <li aria-current="page">
                <div class="flex items-center">
                    <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">All Courses</span>
                </div>
                </li>
            </ol>
        </nav>

        <div className="p-6 border mt-5 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-gray-900 font-semibold">All Courses</h2>
            <button
              className="btn"
              onClick={() => {
                setEditingCourse(null);
                setTitle("");
                setDescription("");
                setImage(null);
                document.getElementById("my_modal_1").showModal();
              }}
            >
              Add Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses?.filter(Boolean).map((course) => (
              <div
                key={course._id}
                className="flex flex-col h-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                {course?.image ? (
                  <img className="rounded-t-lg h-48 w-full object-cover" src={course.image} alt={course.title} />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {course?.title || "Untitled Course"}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700">{course?.description || "No description available"}</p>
                </div>

                {/* Buttons aligned at bottom */}
                <div className="p-5 mt-auto flex justify-between">
                  <div>
                  <button 
                    onClick={() => navigate(`/admin/courses/${course._id}/lessons`)} 
                    className='text-yellow-600 hover:text-yellow-800'
                  >
                    View Lessons
                  </button>
                  </div>
                  <div className='gap-x-2 flex'>
                    <button onClick={() => openEditModal(course)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(course._id)} className="text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

  
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box relative p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-60">
                <ButtonLoading />
              </div>
            ) : (
              <>
                {/* Scrollable Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <h3 className="font-bold text-lg">{editingCourse ? "Edit Course" : "Add a New Course"}</h3>
                  <form onSubmit={handleSubmit} id="courseForm" className="space-y-4 mt-4">
                    <div>
                      <label className="block font-medium">Course Title</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full mt-2 p-2 border rounded" required />
                    </div>
                    <div>
                      <label className="block font-medium">Course Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full mt-2 p-2 border rounded" required />
                    </div>
                    <div>
                      <label className="block font-medium">Course Image</label>
                      <input type="file" onChange={handleFileChange} className="block w-full mt-2 p-2 border rounded" />
                      {image && (
                        <div className="mt-2">
                          <p className="text-gray-600">Current Image Preview:</p>
                          <img src={image} alt="Course Preview" className="w-32 h-32 object-cover border rounded" />
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Fixed Action Buttons */}
                <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    form="courseForm"
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingCourse ? "Update Course" : "Create Course"}
                  </button>
                  <button
                    type="button"
                    className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => document.getElementById('my_modal_1').close()}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </dialog>
        
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            {isLoading ? (
              <ButtonLoading/>
            ) : (
              <>
                <h3 className="font-bold text-lg">Are you sure you want to delete this course?</h3>
                <p className="py-4 text-red-600">This action cannot be undone.</p>
                <div className="modal-action">
                  <button className="btn text-gray-600" onClick={() => document.getElementById('my_modal_2').close()}>Cancel</button>
                  <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
                </div>
              </>
            )}
          </div>
        </dialog>
      </>
    );
};

export default Admin_AllCourses;

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
