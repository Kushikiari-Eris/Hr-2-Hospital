import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const useUserLearningStore = create((set, get) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  currentQuiz: null,
  quizResults: null,
  courseProgress: {},  // Track progress for each course
  completedQuizzes: [], // Store completed quiz IDs
  lessonQuizMap: {},
  loading: false,
  error: null,

  // Fetch all available courses
  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/allCourses");
      set({ courses: response.data, loading: false });
      
      // After loading courses, fetch progress for each
      get().fetchAllProgress();
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch courses", 
        loading: false 
      });
      toast.error("Failed to load courses");
      return [];
    }
  },

  // Fetch all progress data for the current user
  fetchAllProgress: async () => {
    try {
      const response = await axios.get("/progress/user/progress");
      
      // Format progress data by course ID for easy access
      const formattedProgress = {};
      const completedQuizIds = [];
      
      response.data.forEach(item => {
        // Initialize course progress if not exists
        if (!formattedProgress[item.courseId]) {
          formattedProgress[item.courseId] = {
            completedLessons: [],
            completedQuizzes: [],
            totalCompleted: 0,
            totalItems: 0,
          };
        }
        
        // Add completed lessons
        if (item.completedLessons && item.completedLessons.length) {
          formattedProgress[item.courseId].completedLessons = item.completedLessons;
        }
        
        // Add completed quizzes
        if (item.completedQuizzes && item.completedQuizzes.length) {
          formattedProgress[item.courseId].completedQuizzes = item.completedQuizzes;
          completedQuizIds.push(...item.completedQuizzes);
        }
        
        // Calculate total completed items
        formattedProgress[item.courseId].totalCompleted = 
          (formattedProgress[item.courseId].completedLessons.length || 0) + 
          (formattedProgress[item.courseId].completedQuizzes.length || 0);
      });
      
      // Now fetch lesson counts for each course to estimate total items
      const courseIds = Object.keys(formattedProgress);
      if (courseIds.length > 0) {
        // Get current courses or fetch them if not available
        const currentCourses = get().courses.length ? get().courses : await get().fetchCourses();
        
        // Calculate total items for each course
        for (const courseId of courseIds) {
          const course = currentCourses.find(c => c._id === courseId);
          if (course) {
            // If course has lesson count, use it × 2 (lesson + quiz)
            // Otherwise, try to fetch lessons to get count
            if (course.lessons && course.lessons.length) {
              formattedProgress[courseId].totalItems = course.lessons.length * 2;
            } else if (course.lessonCount) {
              formattedProgress[courseId].totalItems = course.lessonCount * 2;
            } else {
              // Try to fetch lessons
              try {
                const lessons = await get().fetchLessons(courseId);
                formattedProgress[courseId].totalItems = lessons.length * 2;
              } catch (err) {
                console.error(`Could not get lesson count for course ${courseId}`, err);
              }
            }
          }
        }
      }
      
      set({ 
        courseProgress: formattedProgress,
        completedQuizzes: completedQuizIds
      });
      
      return formattedProgress;
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      return {};
    }
  },

  // Fetch a single course by ID
  fetchCourse: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/allCourses/${courseId}`);
      set({ currentCourse: response.data, loading: false });
      
      // Also fetch lessons to calculate total items for progress
      const lessons = await get().fetchLessons(courseId);
      
      // Update progress data with total items
      if (get().courseProgress[courseId]) {
        const progress = get().courseProgress[courseId];
        const updatedProgress = {
          ...progress,
          totalItems: lessons.length * 2 // Each lesson + quiz counts as 1 item
        };
        
        set(state => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: updatedProgress
          }
        }));
      }
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch course", 
        loading: false 
      });
      toast.error("Failed to load course details");
      return null;
    }
  },

  // Fetch lessons for a specific course
  fetchLessons: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/lesson/course/${courseId}`);
      
      // If we already have a current course, attach the lessons to it
      if (get().currentCourse && get().currentCourse._id === courseId) {
        set(state => ({
          currentCourse: { ...state.currentCourse, lessons: response.data.data },
          loading: false
        }));
      }
      
      return response.data.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch lessons", 
        loading: false 
      });
      toast.error("Failed to load lessons");
      return [];
    }
  },

  // Fetch a specific lesson
  fetchLesson: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/lesson/${lessonId}`);
      set({ currentLesson: response.data.data, loading: false });
      
      // Mark lesson as viewed/completed
      if (response.data.data) {
        get().markLessonCompleted(response.data.data._id, response.data.data.courseId);
      }
      
      return response.data.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch lesson", 
        loading: false 
      });
      toast.error("Failed to load lesson content");
      return null;
    }
  },

  // Mark a lesson as completed
  markLessonCompleted: async (lessonId, courseId) => {
    try {
      // Make API call to mark lesson as completed
      await axios.post("/progress/user/progress", {
        lessonId,
        courseId,
        completed: true
      });
      
      // Update local state to reflect completion
      const currentProgress = get().courseProgress[courseId] || {
        completedLessons: [],
        completedQuizzes: [],
        totalCompleted: 0,
        totalItems: 0
      };
      
      // Only add if not already in the array
      if (!currentProgress.completedLessons.includes(lessonId)) {
        const updatedProgress = {
          ...currentProgress,
          completedLessons: [...currentProgress.completedLessons, lessonId],
          totalCompleted: currentProgress.totalCompleted + 1
        };
        
        set(state => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: updatedProgress
          }
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
      return false;
    }
  },

  // Fetch quiz for a lesson
  fetchQuiz: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/quiz/lesson/${lessonId}`);
      const quiz = response.data;
      
      // Check if user has already completed this quiz
      const quizCompleted = get().completedQuizzes.includes(quiz._id);
      
      set({ 
        currentQuiz: { ...quiz, completed: quizCompleted },
        loading: false 
      });

      if (quiz) {
        set(state => ({
          lessonQuizMap: {
            ...state.lessonQuizMap,
            [lessonId]: quiz._id
          }
        }));
      }
      
      return { ...quiz, completed: quizCompleted };
    } catch (error) {
      if (error.response?.status === 404) {
        set({ currentQuiz: null, loading: false });
        return null;
      }
      
      set({ 
        error: error.response?.data?.message || "Failed to fetch quiz", 
        loading: false 
      });
      toast.error("Failed to load quiz");
      return null;
    }
  },

  // Submit quiz answers and get results
  submitQuiz: async (quizId, lessonId, courseId, answers) => {
    set({ loading: true, error: null });
    
    // Calculate results locally since there's no backend endpoint for this
    const quiz = get().currentQuiz;
    if (!quiz) {
      set({ 
        error: "Quiz not found", 
        loading: false 
      });
      return null;
    }
    
    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    
    const questionResults = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;
    
    const results = {
      quizId,
      totalQuestions,
      correctAnswers,
      score,
      passed,
      questionResults
    };
    
    // In a real app, save results to the backend
    try {
      await axios.post('/progress/quiz-results', {
        quizId,
        lessonId,
        courseId,
        score,
        passed,
        answers
      });
      
      // Mark quiz as completed
      if (passed) {
        await get().markQuizCompleted(quizId, courseId);
      }
      
      set({ quizResults: results, loading: false });
      return results;
    } catch (error) {
      console.error("Failed to save quiz results:", error);
      set({ quizResults: results, loading: false });
      return results;
    }
  },

  // Mark a quiz as completed
  markQuizCompleted: async (quizId, courseId) => {
    try {
      // Make API call to mark quiz as completed
      await axios.post("/progress/user/quiz-progress", {
        quizId,
        courseId,
        completed: true
      });
      
      // Update local state to reflect completion
      const currentProgress = get().courseProgress[courseId] || {
        completedLessons: [],
        completedQuizzes: [],
        totalCompleted: 0,
        totalItems: 0
      };
      
      // Only add if not already in the array
      if (!currentProgress.completedQuizzes.includes(quizId)) {
        const updatedProgress = {
          ...currentProgress,
          completedQuizzes: [...currentProgress.completedQuizzes, quizId],
          totalCompleted: currentProgress.totalCompleted + 1
        };
        
        set(state => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: updatedProgress
          },
          completedQuizzes: [...state.completedQuizzes, quizId]
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Failed to mark quiz as completed:", error);
      return false;
    }
  },

  clearCurrentLesson: () => set({ currentLesson: null }),
  clearCurrentQuiz: () => set({ currentQuiz: null }),
  clearQuizResults: () => set({ quizResults: null }),
}));

export default useUserLearningStore;