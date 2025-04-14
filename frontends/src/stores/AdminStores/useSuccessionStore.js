import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const useSuccessionStore = create((set, get) => ({
  successionPlans: [],
  currentPlan: null,
  potentialSuccessors: [],
  loading: false,
  error: null,

  // Get all succession plans
  fetchSuccessionPlans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/sucessionPlan");
      set({ successionPlans: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch succession plans",
        loading: false
      });
      toast.error("Failed to fetch succession plans");
    }
  },

  // Get succession plan by ID
  fetchSuccessionPlanById: async (planId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/sucessionPlan/${planId}`);
      set({ currentPlan: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch succession plan",
        loading: false
      });
      toast.error("Failed to fetch succession plan details");
      return null;
    }
  },

  // Create new succession plan
  createSuccessionPlan: async (planData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/sucessionPlan", planData);
      set(state => ({
        successionPlans: [...state.successionPlans, response.data],
        loading: false
      }));
      toast.success("Succession plan created successfully");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create succession plan",
        loading: false
      });
      toast.error(error.response?.data?.message || "Failed to create succession plan");
      return null;
    }
  },

  // Update succession plan
  updateSuccessionPlan: async (planId, planData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/sucessionPlan/${planId}`, planData);
      set(state => ({
        successionPlans: state.successionPlans.map(plan => 
          plan._id === planId ? response.data : plan
        ),
        currentPlan: response.data,
        loading: false
      }));
      toast.success("Succession plan updated successfully");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update succession plan",
        loading: false
      });
      toast.error(error.response?.data?.message || "Failed to update succession plan");
      return null;
    }
  },

  // Delete succession plan
  deleteSuccessionPlan: async (planId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/sucessionPlan/${planId}`);
      set(state => ({
        successionPlans: state.successionPlans.filter(plan => plan._id !== planId),
        loading: false
      }));
      toast.success("Succession plan deleted successfully");
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete succession plan",
        loading: false
      });
      toast.error("Failed to delete succession plan");
      return false;
    }
  },

  // Get succession plans by department
  fetchPlansByDepartment: async (department) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/sucessionPlan/department/${department}`);
      set({ successionPlans: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch plans by department",
        loading: false
      });
      toast.error("Failed to fetch plans by department");
      return [];
    }
  },

  // Get potential successors
  fetchPotentialSuccessors: async (department) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/sucessionPlan/potential-successors`, {
        params: { department }
      });
      set({ potentialSuccessors: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch potential successors",
        loading: false
      });
      toast.error("Failed to fetch potential successors");
      return [];
    }
  },

  // Get succession plans for employee
  fetchPlansForEmployee: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/sucessionPlan/employee');
      set({ successionPlans: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch plans for employee",
        loading: false
      });
      toast.error("Failed to fetch succession plans for employee");
      return [];
    }
  },

  // Get my succession plans (where I'm identified as a successor)
  fetchMySuccessionPlans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/sucessionPlan/my-succession-plans");
      set({ successionPlans: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch your succession plans",
        loading: false
      });
      toast.error("Failed to fetch your succession plans");
      return [];
    }
  },

  // Clear current plan
  clearCurrentPlan: () => {
    set({ currentPlan: null });
  },

  // Reset store
  resetStore: () => {
    set({
      successionPlans: [],
      currentPlan: null,
      potentialSuccessors: [],
      loading: false,
      error: null
    });
  },
}));

export default useSuccessionStore;