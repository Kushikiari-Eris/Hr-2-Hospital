import { create } from "zustand";
import axios from "../../lib/axios";


const useTrainingCourseStore = create((set, get) => ({
  courses: [],
  loading: false,
  error: null,
  
  // Fetch all courses
  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/trainingCourse");
      set({ courses: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch courses', loading: false });
    }
  },
  
  // Get a single course by ID
  getCourseById: (id) => {
    return get().courses.find(course => course._id === id);
  },
  
  // Create a new course
  createCourse: async (courseData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/trainingCourse", courseData);
      set(state => ({ 
        courses: [...state.courses, response.data], 
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create course', loading: false });
      return null;
    }
  },
  
  // Update a course
  updateCourse: async (id, courseData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/trainingCourse/${id}`, courseData);
      set(state => ({
        courses: state.courses.map(course => course._id === id ? response.data : course),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update course', loading: false });
      return null;
    }
  },
  
  // Delete a course
  deleteCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/trainingCourse/${id}`);
      set(state => ({
        courses: state.courses.filter(course => course._id !== id),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete course', loading: false });
      return false;
    }
  }
}));

export default useTrainingCourseStore;