import AllCourses from "../../models/AdminModels/allCourses.model.js";
import cloudinary from "../../config/cloudinary.js"; 

// Create a course
export const createCourse = async (req, res) => {
    try {
      const { title, description, image } = req.body;
  
      let cloudinaryResponse = null;
  
      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "courses",
        });
      }
  
      const course = await AllCourses.create({
        title,
        description,
        image: cloudinaryResponse?.secure_url || "",
      });
  
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Get all courses
  export const getAllCourses = async (req, res) => {
    try {
      const courses = await AllCourses.find();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Get a single course
  export const getCourseById = async (req, res) => {
    try {
      const course = await AllCourses.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Update a course
  export const updateCourse = async (req, res) => {
    try {
      const { title, description, image } = req.body;
  
      let updatedImage = req.body.image;
      if (image) {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "courses",
        });
        updatedImage = cloudinaryResponse.secure_url;
      }
  
      const updatedCourse = await AllCourses.findByIdAndUpdate(
        req.params.id,
        { title, description, image: updatedImage },
        { new: true }
      );
  
      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Delete a course
  export const deleteCourse = async (req, res) => {
    try {
      const course = await AllCourses.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

