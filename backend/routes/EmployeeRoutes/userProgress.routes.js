import express from 'express';
import UserProgress from '../../models/EmployeeModels/userProgress.model.js';
import QuizResult from '../../models/EmployeeModels/quizResult.model.js';
import { protectRoute } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Get all progress for current user
router.get('/user/progress', protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await UserProgress.find({ userId });
    return res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mark a lesson as completed
router.post('/user/progress', protectRoute, async (req, res) => {
  try {
    const { lessonId, courseId, completed } = req.body;
    const userId = req.user.id;

    if (!lessonId || !courseId) {
      return res.status(400).json({ message: 'Lesson ID and Course ID are required' });
    }

    let progress = await UserProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        completedQuizzes: []
      });
    }

    if (completed && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    await progress.save();
    return res.json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Mark a quiz as completed
router.post('/user/quiz-progress', protectRoute, async (req, res) => {
  try {
    const { quizId, courseId, completed } = req.body;
    const userId = req.user.id;

    if (!quizId || !courseId) {
      return res.status(400).json({ message: 'Quiz ID and Course ID are required' });
    }

    let progress = await UserProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        completedQuizzes: []
      });
    }

    if (completed && !progress.completedQuizzes.includes(quizId)) {
      progress.completedQuizzes.push(quizId);
    }

    await progress.save();
    return res.json(progress);
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Save quiz results
router.post('/quiz-results', protectRoute, async (req, res) => {
    try {
      const { quizId, lessonId, courseId, score, passed, answers } = req.body;
      const userId = req.user._id;
  
      if (!quizId || !courseId || !lessonId) {
        return res.status(400).json({ 
          message: 'Quiz ID, Lesson ID and Course ID are required' 
        });
      }
  
      // Check and format answers if needed
      // This is an example - adjust based on your actual schema
      let formattedAnswers;
      if (Array.isArray(answers)) {
        formattedAnswers = answers.map(answer => {
          // If answer is just a number or primitive, convert to object
          if (typeof answer !== 'object' || answer === null) {
            return { 
              questionId: String(answer),
              selectedOption: String(answer),
              // Add other required fields according to your schema
            };
          }
          return answer;
        });
      } else if (answers && typeof answers !== 'object') {
        // If answers is a single value but not an object
        formattedAnswers = [{ 
          questionId: String(answers),
          selectedOption: String(answers),
          // Add other required fields according to your schema
        }];
      } else {
        formattedAnswers = answers || [];
      }
  
      const quizResult = new QuizResult({
        userId,
        quizId,
        lessonId,
        courseId,
        score,
        passed,
        answers: formattedAnswers,
        completedAt: new Date()
      });
  
      await quizResult.save();
  
      // Rest of your code...
      
      return res.json(quizResult);
    } catch (error) {
      console.error('Error saving quiz results:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
