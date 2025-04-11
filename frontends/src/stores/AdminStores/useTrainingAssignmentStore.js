import { create } from "zustand";
import axios from "../../lib/axios";


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
      set({ error: error.response?.data?.message || 'Failed to fetch expiry report', loading: false });
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
      set({ error: error.response?.data?.message || 'Failed to fetch assignments', loading: false });
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
      set({ error: error.response?.data?.message || 'Failed to fetch user assignments', loading: false });
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
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create assignment', loading: false });
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
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update assignment', loading: false });
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
      
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete assignment', loading: false });
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
      set({ error: error.response?.data?.message || 'Failed to fetch compliance report', loading: false });
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
      set({ error: error.response?.data?.message || 'Failed to fetch training gaps', loading: false });
      return [];
    }
  }
}));

export default useTrainingAssignmentStore;