import Lesson from '../../models/AdminModels/lesson.model.js';
import AllCourses from '../../models/AdminModels/allCourses.model.js';

// Get all lessons for a course
export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessons = await Lesson.find({ courseId })
      .sort({ order: 1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons',
      error: error.message
    });
  }
};

// Get a single lesson by ID
export const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson',
      error: error.message
    });
  }
};

// Create a new lesson
export const createLesson = async (req, res) => {
  try {
    const { title, content, courseId, order, resources, duration, isPublished } = req.body;
    
    // Verify the course exists
    const course = await AllCourses.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Create new lesson
    const lesson = await Lesson.create({
      title,
      content,
      courseId,
      order,
      resources,
      duration,
      isPublished
    });
    
    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson',
      error: error.message
    });
  }
};

// Update a lesson
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson',
      error: error.message
    });
  }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByIdAndDelete(id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson',
      error: error.message
    });
  }
};