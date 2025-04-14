import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

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
      const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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
      toast.success("Course created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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
      toast.success("Course updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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
      toast.success("Course deleted successfully!");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete course';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  }
}));

export default useTrainingCourseStore;
