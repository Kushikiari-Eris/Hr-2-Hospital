import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const useLessonStore = create((set, get) => ({
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  // Fetch all lessons for a course
  fetchLessonsByCourse: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/lesson/course/${courseId}`);
      set({ lessons: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch lessons', 
        loading: false 
      });
      return [];
    }
  },
  
  // Fetch a single lesson
  fetchLesson: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/lesson/${lessonId}`);
      set({ currentLesson: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch lesson', 
        loading: false 
      });
      return null;
    }
  },
  
  // Create a new lesson
  createLesson: async (lessonData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/lesson', lessonData);
      set(state => ({
        lessons: [...state.lessons, response.data.data],
        loading: false
      }));
      return response.data.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to create lesson', 
        loading: false 
      });
      return null;
    }
  },
  
  // Update a lesson
  updateLesson: async (lessonId, lessonData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/lesson/${lessonId}`, lessonData);
      set(state => ({
        lessons: state.lessons.map(lesson => 
          lesson._id === lessonId ? response.data.data : lesson
        ),
        currentLesson: state.currentLesson?._id === lessonId ? 
          response.data.data : state.currentLesson,
        loading: false
      }));
      return response.data.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update lesson', 
        loading: false 
      });
      return null;
    }
  },
  
  // Delete a lesson
  deleteLesson: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/lesson/${lessonId}`);
      set(state => ({
        lessons: state.lessons.filter(lesson => lesson._id !== lessonId),
        currentLesson: state.currentLesson?._id === lessonId ? null : state.currentLesson,
        loading: false
      }));
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete lesson', 
        loading: false 
      });
      return false;
    }
  },
  
  // Clear current lesson
  clearCurrentLesson: () => {
    set({ currentLesson: null });
  }
}));

export default useLessonStore;