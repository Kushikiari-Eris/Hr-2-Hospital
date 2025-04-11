import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

export const useAllCoursesStore = create((set) => ({
  courses: [],

  // Fetch all courses from the backend API
  fetchCourses: async () => {
    try {
      const response = await axios.get("/allCourses");
      set({ courses: response.data });
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses.");
    }
  },

  // Add a new course to the backend and update the local store
  addCourse: async (courseData) => {
    try {
      const response = await axios.post("/allCourses/create", courseData, {
        headers: { "Content-Type": "application/json" },
      });

      set((state) => ({ courses: [...state.courses, response.data] }));
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to add course.");
    }
  },

  // Delete a course from the backend and update the local store
  deleteCourse: async (id) => {
    try {
      await axios.delete(`/allCourses/${id}`);
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== id),
      }));
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course.");
    }
  },

  // Update a course in the backend and update the local store
  updateCourse: async (id, updatedData) => {
    try {
      const response = await axios.put(`/allCourses/${id}`, updatedData);
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id ? { ...course, ...updatedData } : course
        ),
      }));
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course.");
    }
  },
  
}));

export default useAllCoursesStore;
