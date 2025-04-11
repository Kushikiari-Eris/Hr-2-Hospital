// routes/coursesRoutes.js
import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../controllers/AdminControllers/allCourses.controller.js";

const router = express.Router();

// Create course
router.post("/create", createCourse);

// Get all courses
router.get("/", getAllCourses);

// Get a single course by ID
router.get("/:id", getCourseById);

// Update course
router.put("/:courseId", updateCourse);

// Delete course
router.delete("/:id", deleteCourse);

export default router;
