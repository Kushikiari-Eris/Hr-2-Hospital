import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const useQuizStore = create((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
  
  // Fetch all quizzes
  fetchAllQuizzes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/quiz');
      set({ quizzes: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },
  
  // Fetch quiz by lesson ID
  fetchQuizByLesson: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/quiz/lesson/${lessonId}`);
      set({ currentQuiz: response.data, loading: false });
      return response.data;
    } catch (error) {
      // If quiz doesn't exist for this lesson, set currentQuiz to null
      if (error.response?.status === 404) {
        set({ currentQuiz: null, loading: false });
        return null;
      }
      set({ error: error.response?.data?.message || error.message, loading: false });
      return null;
    }
  },
  
  // Create a new quiz
  createQuiz: async (quizData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/quiz', quizData);
      set((state) => ({
        quizzes: [...state.quizzes, response.data],
        currentQuiz: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return null;
    }
  },
  
  // Update an existing quiz
  updateQuiz: async (id, quizData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/quiz/${id}`, quizData);
      set((state) => ({
        quizzes: state.quizzes.map(quiz => 
          quiz._id === id ? response.data : quiz
        ),
        currentQuiz: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return null;
    }
  },
  
  // Delete a quiz
  deleteQuiz: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/quiz/${id}`);
      set((state) => ({
        quizzes: state.quizzes.filter(quiz => quiz._id !== id),
        currentQuiz: state.currentQuiz?._id === id ? null : state.currentQuiz,
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return false;
    }
  },
  
  // Add a question to a quiz
  addQuestion: async (quizId, questionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`/quiz/${quizId}/questions`, questionData);
      set((state) => ({
        quizzes: state.quizzes.map(quiz => 
          quiz._id === quizId ? response.data : quiz
        ),
        currentQuiz: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return null;
    }
  },
  
  // Remove a question from a quiz
  removeQuestion: async (quizId, questionId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`/quiz/${quizId}/questions/${questionId}`);
      set((state) => ({
        quizzes: state.quizzes.map(quiz => 
          quiz._id === quizId ? response.data : quiz
        ),
        currentQuiz: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return null;
    }
  },
  
  // Clear current quiz
  clearCurrentQuiz: () => {
    set({ currentQuiz: null });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useQuizStore;