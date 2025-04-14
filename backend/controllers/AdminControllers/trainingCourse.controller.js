import TrainingCourse from "../../models/AdminModels/trainingCourse.model.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await TrainingCourse.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCourse = async (req, res) => {
  const course = new TrainingCourse({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    content: req.body.content,
    duration: req.body.duration,
    expiryPeriod: req.body.expiryPeriod
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (req.body.title) course.title = req.body.title;
    if (req.body.description) course.description = req.body.description;
    if (req.body.type) course.type = req.body.type;
    if (req.body.content) course.content = req.body.content;
    if (req.body.duration) course.duration = req.body.duration;
    if (req.body.expiryPeriod) course.expiryPeriod = req.body.expiryPeriod;
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await TrainingCourse.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

