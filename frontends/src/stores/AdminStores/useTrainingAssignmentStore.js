import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const useTrainingAssignmentStore = create((set, get) => ({
  expiryReport: [],
  assignments: [],
  userAssignments: {},
  complianceReport: [],
  trainingGaps: [],
  loading: false,
  error: null,

  fetchExpiryReport: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/trainingAssignment/reports/expiry`);
      set({ expiryReport: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch expiry report';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch all assignments
  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/trainingAssignment`);
      set({ assignments: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch assignments';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
  
  // Fetch assignments for a specific user
  fetchUserAssignments: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/trainingAssignment/user/${userId}`);
      set(state => ({ 
        userAssignments: { ...state.userAssignments, [userId]: response.data },
        loading: false 
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user assignments';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Create a new assignment
  createAssignment: async (assignmentData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`/trainingAssignment`, assignmentData);
      set(state => ({ 
        assignments: [...state.assignments, response.data], 
        loading: false 
      }));
      
      // Update user assignments if we have them cached
      if (get().userAssignments[assignmentData.userId]) {
        set(state => ({
          userAssignments: {
            ...state.userAssignments,
            [assignmentData.userId]: [...state.userAssignments[assignmentData.userId], response.data]
          }
        }));
      }
      
      toast.success("Assignment created successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create assignment';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Update an assignment
  updateAssignment: async (id, assignmentData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/trainingAssignment/${id}`, assignmentData);
      set(state => ({
        assignments: state.assignments.map(assignment => 
          assignment._id === id ? response.data : assignment
        ),
        loading: false
      }));
      
      // Update in user assignments if present
      const userId = response.data.user._id;
      if (get().userAssignments[userId]) {
        set(state => ({
          userAssignments: {
            ...state.userAssignments,
            [userId]: state.userAssignments[userId].map(assignment =>
              assignment._id === id ? response.data : assignment
            )
          }
        }));
      }
      
      toast.success("Assignment updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update assignment';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Delete an assignment
  deleteAssignment: async (id) => {
    set({ loading: true, error: null });
    try {
      const assignmentToDelete = get().assignments.find(a => a._id === id);
      const userId = assignmentToDelete?.user._id;
      
      await axios.delete(`/trainingAssignment/${id}`);
      
      set(state => ({
        assignments: state.assignments.filter(assignment => assignment._id !== id),
        loading: false
      }));
      
      // Remove from user assignments if present
      if (userId && get().userAssignments[userId]) {
        set(state => ({
          userAssignments: {
            ...state.userAssignments,
            [userId]: state.userAssignments[userId].filter(assignment => 
              assignment._id !== id
            )
          }
        }));
      }
      
      toast.success("Assignment deleted successfully");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete assignment';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },
  
  // Fetch compliance report
  fetchComplianceReport: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/trainingAssignment/reports/compliance`);
      set({ complianceReport: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch compliance report';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },
  
  // Fetch training gaps report
  fetchTrainingGaps: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/trainingAssignment/reports/gaps`);
      set({ trainingGaps: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch training gaps';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  }
}));

export default useTrainingAssignmentStore;