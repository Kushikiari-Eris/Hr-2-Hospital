// store/useDashboardStore.js
import { create } from 'zustand';
import axios from "../../lib/axios";

const useAdminDashbaoardStore = create((set) => ({
  // Dashboard stats
  dashboardStats: null,
  courseAnalytics: null,
  successionAnalytics: null,
  
  // Loading states
  isLoadingStats: false,
  isLoadingCourseAnalytics: false,
  isLoadingSuccessionAnalytics: false,
  
  // Error states
  statsError: null,
  courseAnalyticsError: null,
  successionAnalyticsError: null,
  
  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    set({ isLoadingStats: true, statsError: null });
    try {
      const response = await axios.get('/adminDashboard/stats');
      set({ 
        dashboardStats: response.data.data,
        isLoadingStats: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      set({
        isLoadingStats: false,
        statsError: error.response?.data?.message || 'Failed to fetch dashboard stats'
      });
    }
  },
  
  // Fetch course analytics
  fetchCourseAnalytics: async () => {
    set({ isLoadingCourseAnalytics: true, courseAnalyticsError: null });
    try {
      const response = await axios.get('/adminDashboard/course-analytics');
      set({ 
        courseAnalytics: response.data.data,
        isLoadingCourseAnalytics: false
      });
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      set({
        isLoadingCourseAnalytics: false,
        courseAnalyticsError: error.response?.data?.message || 'Failed to fetch course analytics'
      });
    }
  },
  
  // Fetch succession planning analytics
  fetchSuccessionAnalytics: async () => {
    set({ isLoadingSuccessionAnalytics: true, successionAnalyticsError: null });
    try {
      const response = await axios.get('/adminDashboard/succession-analytics');
      set({ 
        successionAnalytics: response.data.data,
        isLoadingSuccessionAnalytics: false
      });
    } catch (error) {
      console.error('Error fetching succession analytics:', error);
      set({
        isLoadingSuccessionAnalytics: false,
        successionAnalyticsError: error.response?.data?.message || 'Failed to fetch succession analytics'
      });
    }
  },
  
  // Reset store
  resetDashboardStore: () => {
    set({
      dashboardStats: null,
      courseAnalytics: null,
      successionAnalytics: null,
      isLoadingStats: false,
      isLoadingCourseAnalytics: false,
      isLoadingSuccessionAnalytics: false,
      statsError: null,
      courseAnalyticsError: null,
      successionAnalyticsError: null
    });
  }
}));

export default useAdminDashbaoardStore;