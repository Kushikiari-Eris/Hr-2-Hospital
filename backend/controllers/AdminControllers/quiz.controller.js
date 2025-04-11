import Quiz from "../../models/AdminModels/quiz.model.js";
import mongoose from "mongoose";

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz by lessonId
export const getQuizByLesson = async (req, res) => {
    try {
      const { lessonId } = req.params;
  
      const quizzes = await Quiz.findOne({ lessonId: new mongoose.Types.ObjectId(lessonId) });
  
      if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ message: 'No quizzes found for this lesson' });
      }
  
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new question to a quiz
export const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    quiz.questions.push(req.body);
    quiz.updatedAt = Date.now();
    
    const updatedQuiz = await quiz.save();
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a question from a quiz
export const removeQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    quiz.questions = quiz.questions.filter(
      question => question._id.toString() !== questionId
    );
    quiz.updatedAt = Date.now();
    
    const updatedQuiz = await quiz.save();
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};